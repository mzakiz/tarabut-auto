
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
    
    // Define function schemas for structured extraction
    const salaryCertificateFunction = {
      name: "extract_salary_certificate_data",
      description: "Extract structured data from a salary certificate document",
      parameters: {
        type: "object",
        properties: {
          monthly_gross_salary: { type: "number", description: "Monthly gross salary amount" },
          basic_salary: { type: "number", description: "Basic salary amount" },
          allowances: { type: "number", description: "Total allowances amount" },
          total_deductions: { type: "number", description: "Total deductions amount" },
          net_salary: { type: "number", description: "Net salary after deductions" },
          currency: { type: "string", description: "Currency code (e.g., SAR)" },
          employee_name: { type: "string", description: "Employee full name" },
          company_name: { type: "string", description: "Company name" },
          issue_date: { type: "string", description: "Issue date in YYYY-MM-DD format" },
          confidence_score: { type: "number", description: "Confidence score between 0 and 1" }
        },
        required: ["monthly_gross_salary", "currency", "confidence_score"]
      }
    };

    const bankStatementFunction = {
      name: "extract_bank_statement_data",
      description: "Extract structured data from a bank statement document",
      parameters: {
        type: "object",
        properties: {
          monthly_salary_deposits: {
            type: "array",
            items: {
              type: "object",
              properties: {
                amount: { type: "number" },
                date: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          average_monthly_income: { type: "number", description: "Average monthly income" },
          currency: { type: "string", description: "Currency code (e.g., SAR)" },
          account_holder_name: { type: "string", description: "Account holder name" },
          bank_name: { type: "string", description: "Bank name" },
          statement_period: {
            type: "object",
            properties: {
              from: { type: "string", description: "Statement start date YYYY-MM-DD" },
              to: { type: "string", description: "Statement end date YYYY-MM-DD" }
            }
          },
          confidence_score: { type: "number", description: "Confidence score between 0 and 1" }
        },
        required: ["average_monthly_income", "currency", "confidence_score"]
      }
    };

    console.log('Calling OpenAI API for document analysis...');
    
    let analysisResponse;
    let extractedData;

    if (fileExtension === 'pdf') {
      // For PDFs, extract text and use Chat Completions with function calling
      console.log('Processing PDF file...');
      
      // Convert PDF to text using a simple approach
      // Note: This is a basic implementation. For production, you might want to use a more robust PDF parser
      const arrayBuffer = await fileBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Try to extract text from PDF using a simple method
      // This is a basic implementation - for better results, consider using a dedicated PDF parsing service
      let textContent = '';
      try {
        // Convert to string and try to extract readable text
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8Array);
        
        // Extract readable text using basic regex patterns
        const textMatches = rawText.match(/[A-Za-z0-9\s\.,;:!?\-()]+/g);
        if (textMatches) {
          textContent = textMatches.join(' ').replace(/\s+/g, ' ').trim();
        }
        
        // If no meaningful text found, throw error
        if (textContent.length < 50) {
          throw new Error('Could not extract sufficient text from PDF');
        }
        
        console.log('Extracted text length:', textContent.length);
      } catch (error) {
        console.error('PDF text extraction failed:', error);
        throw new Error('Failed to extract text from PDF. Please try uploading the document as an image (PNG/JPG) for better results.');
      }

      // Use Chat Completions with function calling for text-based analysis
      const systemPrompt = documentType === 'salary_certificate' 
        ? `You are a document analysis expert. Analyze the provided salary certificate text and extract structured information. Focus on identifying salary amounts, employee details, and company information. If the document is in Arabic, translate numerical values to English. Return accurate data with a confidence score based on text clarity and completeness.`
        : `You are a document analysis expert. Analyze the provided bank statement text and extract salary-related transactions. Look for recurring deposits that appear to be salary payments. Calculate average monthly income based on identified salary deposits. Return accurate data with a confidence score.`;

      analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Please analyze this ${documentType.replace('_', ' ')} text and extract the structured information:\n\n${textContent}`
            }
          ],
          functions: [documentType === 'salary_certificate' ? salaryCertificateFunction : bankStatementFunction],
          function_call: { name: documentType === 'salary_certificate' ? 'extract_salary_certificate_data' : 'extract_bank_statement_data' },
          temperature: 0.1
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('OpenAI analysis error:', analysisResponse.status, errorText);
        throw new Error(`OpenAI analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log('Extracted data from PDF text:', extractedData);
      } else {
        throw new Error('Failed to extract structured data from document text');
      }

    } else {
      // For images, use Vision API with function calling
      console.log('Processing image file...');
      
      const base64Data = await blobToBase64(fileBlob);
      const mimeType = fileBlob.type || `image/${fileExtension}`;
      
      const systemPrompt = documentType === 'salary_certificate' 
        ? `You are a document analysis expert. Analyze this salary certificate image and extract structured information. Focus on identifying salary amounts, employee details, and company information. If the document is in Arabic, translate numerical values to English. Return accurate data with a confidence score based on image clarity and completeness.`
        : `You are a document analysis expert. Analyze this bank statement image and extract salary-related transactions. Look for recurring deposits that appear to be salary payments. Calculate average monthly income based on identified salary deposits. Return accurate data with a confidence score.`;

      analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Please analyze this ${documentType.replace('_', ' ')} image and extract the structured information.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          functions: [documentType === 'salary_certificate' ? salaryCertificateFunction : bankStatementFunction],
          function_call: { name: documentType === 'salary_certificate' ? 'extract_salary_certificate_data' : 'extract_bank_statement_data' },
          temperature: 0.1
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('OpenAI analysis error:', analysisResponse.status, errorText);
        throw new Error(`OpenAI analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log('Extracted data from image:', extractedData);
      } else {
        throw new Error('Failed to extract structured data from document image');
      }
    }

    const confidenceScore = extractedData.confidence_score || 0.8;
    
    console.log('Document analysis completed successfully');

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
