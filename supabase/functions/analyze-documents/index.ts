
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
    
    console.log('Calling OpenAI API for document analysis...');
    
    let analysisResponse;
    let extractedData;

    if (fileExtension === 'pdf') {
      // For PDFs, extract text and use Chat Completions with functions
      console.log('Processing PDF file...');
      
      const arrayBuffer = await fileBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Improved PDF text extraction using proper PDF parsing
      let textContent = '';
      try {
        // Convert to text decoder and look for text objects in PDF
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const pdfContent = decoder.decode(uint8Array);
        
        // Extract text between BT and ET operators (text objects in PDF)
        const textObjectRegex = /BT\s*(.*?)\s*ET/gs;
        const textMatches = pdfContent.match(textObjectRegex);
        
        if (textMatches) {
          for (const match of textMatches) {
            // Extract text within parentheses or brackets
            const textRegex = /\((.*?)\)|<(.*?)>/g;
            let textMatch;
            while ((textMatch = textRegex.exec(match)) !== null) {
              const extractedText = textMatch[1] || textMatch[2];
              if (extractedText && extractedText.length > 1) {
                textContent += extractedText + ' ';
              }
            }
          }
        }
        
        // Fallback: look for readable text patterns
        if (textContent.length < 50) {
          const readableTextRegex = /[A-Za-z]{3,}(?:\s+[A-Za-z0-9,.\-]+)*/g;
          const readableMatches = pdfContent.match(readableTextRegex);
          if (readableMatches) {
            textContent = readableMatches.filter(text => text.length > 3).join(' ');
          }
        }
        
        // Clean up the extracted text
        textContent = textContent
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s\.,;:!?\-()]/g, ' ')
          .trim();
        
        if (textContent.length < 20) {
          throw new Error('Could not extract sufficient readable text from PDF');
        }
        
        console.log('Extracted text length:', textContent.length);
        console.log('First 500 chars of extracted text:', textContent.substring(0, 500));
      } catch (error) {
        console.error('PDF text extraction failed:', error);
        throw new Error('Failed to extract text from PDF. Please try uploading the document as an image (PNG/JPG) for better results.');
      }

      // Prepare messages following the integration guide format
      const systemMessage = documentType === 'salary_certificate' 
        ? `You are an assistant that extracts salary information from a salary certificate. 
           Look for salary amounts, basic pay, allowances, deductions, and net pay.
           Respond ONLY with a function call to extract_salary_data.`
        : `You are an assistant that extracts salary-related transactions from bank statements.
           Look for recurring deposits that appear to be salary payments.
           Respond ONLY with a function call to extract_bank_data.`;

      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Please analyze this ${documentType.replace('_', ' ')} text and extract the information:\n\n${textContent}` }
      ];

      // Define functions following the integration guide format (not tools)
      const functions = documentType === 'salary_certificate' ? [{
        name: "extract_salary_data",
        description: "Extract structured salary data from a salary certificate",
        parameters: {
          type: "object",
          properties: {
            monthly_gross_salary: { 
              type: "number", 
              description: "Monthly gross salary amount in numbers" 
            },
            basic_salary: { 
              type: "number", 
              description: "Basic salary amount" 
            },
            allowances: { 
              type: "number", 
              description: "Total allowances amount" 
            },
            total_deductions: { 
              type: "number", 
              description: "Total deductions amount" 
            },
            net_salary: { 
              type: "number", 
              description: "Net salary after deductions" 
            },
            currency: { 
              type: "string", 
              description: "Currency code (e.g., SAR)" 
            },
            employee_name: { 
              type: "string", 
              description: "Employee full name" 
            },
            company_name: { 
              type: "string", 
              description: "Company name" 
            },
            confidence_score: { 
              type: "number", 
              description: "Confidence score between 0 and 1" 
            }
          },
          required: ["currency", "confidence_score"]
        }
      }] : [{
        name: "extract_bank_data",
        description: "Extract structured data from a bank statement",
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
            average_monthly_income: { 
              type: "number", 
              description: "Average monthly income calculated from salary deposits" 
            },
            currency: { 
              type: "string", 
              description: "Currency code (e.g., SAR)" 
            },
            account_holder_name: { 
              type: "string", 
              description: "Account holder name" 
            },
            bank_name: { 
              type: "string", 
              description: "Bank name" 
            },
            confidence_score: { 
              type: "number", 
              description: "Confidence score between 0 and 1" 
            }
          },
          required: ["currency", "confidence_score"]
        }
      }];

      // Use the older function calling format as per integration guide
      analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          functions,
          function_call: { 
            name: documentType === 'salary_certificate' ? 'extract_salary_data' : 'extract_bank_data' 
          },
          temperature: 0.1
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('OpenAI analysis error:', analysisResponse.status, errorText);
        throw new Error(`OpenAI analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      console.log('OpenAI response:', JSON.stringify(analysisData, null, 2));
      
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call && responseMessage.function_call.arguments) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log('Extracted data from PDF text:', extractedData);
      } else {
        console.error('No function call in response:', responseMessage);
        throw new Error('Failed to extract structured data from document text');
      }

    } else {
      // For images, use Vision API with the older functions format
      console.log('Processing image file...');
      
      const base64Data = await blobToBase64(fileBlob);
      const mimeType = fileBlob.type || `image/${fileExtension}`;
      
      const systemMessage = documentType === 'salary_certificate' 
        ? `You are an assistant that extracts salary information from a salary certificate image.
           Look carefully at all numbers and text in the image.
           Respond ONLY with a function call to extract_salary_data.`
        : `You are an assistant that extracts salary-related transactions from bank statement images.
           Look for recurring deposits that appear to be salary payments.
           Respond ONLY with a function call to extract_bank_data.`;

      const messages = [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze this ${documentType.replace('_', ' ')} image carefully and extract all the structured information you can see.`
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
      ];

      // Use same functions as PDF processing
      const functions = documentType === 'salary_certificate' ? [{
        name: "extract_salary_data",
        description: "Extract structured salary data from a salary certificate image",
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
            confidence_score: { type: "number", description: "Confidence score between 0 and 1" }
          },
          required: ["currency", "confidence_score"]
        }
      }] : [{
        name: "extract_bank_data",
        description: "Extract structured data from a bank statement image",
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
            confidence_score: { type: "number", description: "Confidence score between 0 and 1" }
          },
          required: ["currency", "confidence_score"]
        }
      }];

      analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          functions,
          function_call: { 
            name: documentType === 'salary_certificate' ? 'extract_salary_data' : 'extract_bank_data' 
          },
          temperature: 0.1
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('OpenAI analysis error:', analysisResponse.status, errorText);
        throw new Error(`OpenAI analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      console.log('OpenAI response for image:', JSON.stringify(analysisData, null, 2));
      
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call && responseMessage.function_call.arguments) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log('Extracted data from image:', extractedData);
      } else {
        console.error('No function call in response:', responseMessage);
        throw new Error('Failed to extract structured data from document image');
      }
    }

    const confidenceScore = extractedData.confidence_score || 0.5;
    
    console.log('Document analysis completed successfully with confidence:', confidenceScore);
    console.log('Final extracted data:', JSON.stringify(extractedData, null, 2));

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
