
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentAnalysisRequest {
  documentId: string;
  fileUrl: string;
  documentType: 'salary_certificate' | 'bank_statement';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: DocumentAnalysisRequest;
  
  try {
    requestBody = await req.json() as DocumentAnalysisRequest;
    const { documentId, fileUrl, documentType } = requestBody;
    
    console.log('Processing document:', { documentId, documentType, fileUrl: fileUrl.substring(0, 50) + '...' });
    
    // Check if OpenAI API key is available
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update document status to processing
    await supabase
      .from('document_uploads')
      .update({ processing_status: 'processing' })
      .eq('id', documentId);

    // Get file information to determine the file type
    const urlParams = new URL(fileUrl);
    const filePath = urlParams.pathname;
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    console.log('File extension detected:', fileExtension);

    // Check if file is a supported format
    const supportedFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'];
    if (!supportedFormats.includes(fileExtension || '')) {
      throw new Error('Unsupported file format. Please upload PDF, PNG, JPG, JPEG, GIF, or WEBP files.');
    }

    // Fetch the file from Supabase storage
    console.log('Fetching file from storage...');
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    
    const fileBlob = await fileResponse.blob();
    const fileName = `document_${documentId}.${fileExtension}`;
    
    // Upload file to OpenAI Files API
    console.log('Uploading file to OpenAI...');
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);
    formData.append('purpose', 'vision');

    const uploadResponse = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('OpenAI file upload error:', uploadResponse.status, errorText);
      throw new Error(`Failed to upload file to OpenAI: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;
    console.log('File uploaded to OpenAI with ID:', fileId);

    // Prepare OpenAI prompt based on document type
    const prompt = documentType === 'salary_certificate' 
      ? `Analyze this salary certificate document and extract the following information in JSON format:
        {
          "monthly_gross_salary": number,
          "basic_salary": number,
          "allowances": number,
          "total_deductions": number,
          "net_salary": number,
          "currency": "SAR",
          "employee_name": "string",
          "company_name": "string",
          "issue_date": "YYYY-MM-DD",
          "confidence_score": number (0-1)
        }
        
        Focus on extracting accurate salary amounts. If the document is in Arabic, translate the numerical values. Return only the JSON object, no additional text.`
      : `Analyze this bank statement document and extract salary-related information in JSON format:
        {
          "monthly_salary_deposits": [
            {
              "amount": number,
              "date": "YYYY-MM-DD",
              "description": "string"
            }
          ],
          "average_monthly_income": number,
          "currency": "SAR",
          "account_holder_name": "string",
          "bank_name": "string",
          "statement_period": {
            "from": "YYYY-MM-DD",
            "to": "YYYY-MM-DD"
          },
          "confidence_score": number (0-1)
        }
        
        Focus on identifying recurring salary deposits. Return only the JSON object, no additional text.`;

    console.log('Calling OpenAI API for document analysis...');
    
    // Use GPT-4o with the uploaded file for analysis
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${fileBlob.type};base64,${await blobToBase64(fileBlob)}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      }),
    });

    // Clean up: Delete the uploaded file from OpenAI
    try {
      await fetch(`https://api.openai.com/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
        },
      });
      console.log('Cleaned up uploaded file from OpenAI');
    } catch (cleanupError) {
      console.warn('Failed to cleanup file from OpenAI:', cleanupError);
    }

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI analysis error:', analysisResponse.status, errorText);
      throw new Error(`OpenAI analysis failed: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const extractedText = analysisData.choices[0].message.content;
    
    console.log('OpenAI analysis completed:', extractedText.substring(0, 200) + '...');
    
    // Parse the JSON response
    let extractedData;
    let confidenceScore = 0.8; // Default confidence for successful analysis
    
    try {
      extractedData = JSON.parse(extractedText);
      confidenceScore = extractedData.confidence_score || 0.8;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', extractedText);
      throw new Error('Failed to extract structured data from document');
    }

    // Update document with extracted data
    const { error: updateError } = await supabase
      .from('document_uploads')
      .update({
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        extracted_data: extractedData,
        confidence_score: confidenceScore
      })
      .eq('id', documentId);

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log('Document analysis completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        extractedData,
        confidenceScore
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Document analysis error:', error);
    
    // Try to update document status to failed if we have the documentId
    if (requestBody?.documentId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('document_uploads')
          .update({
            processing_status: 'failed',
            error_message: error.message
          })
          .eq('id', requestBody.documentId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
