
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

    // Prepare OpenAI prompt based on document type
    const prompt = documentType === 'salary_certificate' 
      ? `Analyze this salary certificate and extract the following information in JSON format:
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
      : `Analyze this bank statement and extract salary-related information in JSON format:
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

    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                  url: fileUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', openAIResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    const extractedText = openAIData.choices[0].message.content;
    
    console.log('OpenAI response received:', extractedText.substring(0, 200) + '...');
    
    // Parse the JSON response
    let extractedData;
    let confidenceScore = 0;
    
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
