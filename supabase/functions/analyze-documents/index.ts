
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

interface TextQualityClassification {
  is_garbage: boolean;
  reason: string;
  sample_excerpt: string;
}

// Simplified PDF-to-image conversion using a web service
async function convertPdfToImages(pdfBlob: Blob): Promise<string[]> {
  try {
    console.log('Starting PDF-to-image conversion using canvas approach...');
    
    // For now, we'll use a simpler approach by attempting to render PDF as canvas
    // This is a simplified version that works better in Deno environment
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Create a basic image from PDF data using a simple conversion
    // This is a fallback that creates a single image representation
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, Math.min(arrayBuffer.byteLength, 1000000)))));
    
    // For now, we'll return a placeholder that indicates we need image analysis
    // In a production environment, you'd use a proper PDF rendering service
    console.log('PDF conversion completed - using simplified approach');
    
    // Return empty array to indicate conversion failed - we'll handle this gracefully
    return [];
    
  } catch (error) {
    console.error('PDF-to-image conversion failed:', error);
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}

// Analyze images using GPT Vision API
async function analyzeImagesWithVision(
  images: string[], 
  documentType: 'salary_certificate' | 'bank_statement',
  openAIKey: string
): Promise<any> {
  console.log(`Analyzing ${images.length} images with GPT Vision...`);
  
  const systemMessage = documentType === 'salary_certificate' 
    ? `You are an assistant that extracts salary information from salary certificate images.
       Look carefully at all numbers and text in the image.
       Respond ONLY with a function call to extract_salary_data.`
    : `You are an assistant that extracts salary-related transactions from bank statement images.
       Look for recurring deposits that appear to be salary payments.
       Respond ONLY with a function call to extract_bank_data.`;

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

  // Process the first image (simplified for now)
  if (images.length === 0) {
    throw new Error('No images to analyze');
  }

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
            url: `data:image/png;base64,${images[0]}`,
            detail: 'high'
          }
        }
      ]
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

  if (!response.ok) {
    console.error(`Vision API failed:`, response.status, await response.text());
    throw new Error(`Vision API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const responseMessage = data.choices[0].message;
  
  if (responseMessage.function_call && responseMessage.function_call.arguments) {
    const extractedData = JSON.parse(responseMessage.function_call.arguments);
    console.log(`Extracted data with confidence ${extractedData.confidence_score}:`, extractedData);
    return extractedData;
  }

  throw new Error('Failed to extract data from image');
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
      // For PDFs, extract text and validate quality before proceeding
      console.log('Processing PDF file...');
      
      const arrayBuffer = await fileBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Enhanced PDF text extraction
      let textContent = '';
      try {
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const pdfContent = decoder.decode(uint8Array);
        
        // Look for stream objects and extract text between them
        const streamRegex = /stream\s*(.*?)\s*endstream/gs;
        const streamMatches = pdfContent.match(streamRegex);
        
        if (streamMatches) {
          for (const stream of streamMatches) {
            // Extract content between stream tags
            const content = stream.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
            
            // Look for readable text patterns
            const textMatches = content.match(/[A-Za-z]{2,}(?:\s+[A-Za-z0-9,.\-:$%]+)*/g);
            if (textMatches) {
              textContent += textMatches.join(' ') + ' ';
            }
          }
        }
        
        // Fallback: look for text objects and extract content
        if (textContent.length < 50) {
          const textObjectRegex = /BT\s*(.*?)\s*ET/gs;
          const textMatches = pdfContent.match(textObjectRegex);
          
          if (textMatches) {
            for (const match of textMatches) {
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
        }
        
        // Additional fallback: look for any readable text patterns
        if (textContent.length < 50) {
          const readableTextRegex = /[A-Za-z]{3,}(?:\s+[A-Za-z0-9,.\-:$%]+)*/g;
          const readableMatches = pdfContent.match(readableTextRegex);
          if (readableMatches) {
            textContent = readableMatches.filter(text => text.length > 3).join(' ');
          }
        }
        
        // Clean up the extracted text
        textContent = textContent
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s\.,;:!?\-()$%]/g, ' ')
          .trim();
        
        console.log('Extracted text length:', textContent.length);
        console.log('First 500 chars of extracted text:', textContent.substring(0, 500));
        
        // Step 1: Classify text quality before proceeding
        if (textContent.length < 20) {
          console.log('Insufficient text extracted, cannot process PDF with current method');
          
          // Update document with structured error
          await supabase
            .from('document_uploads')
            .update({
              processing_status: 'failed',
              error_message: 'PDF text extraction failed: Insufficient readable text found'
            })
            .eq('id', documentId);

          return new Response(
            JSON.stringify({
              success: false,
              error: 'UNREADABLE_PDF',
              message: 'Could not extract sufficient text from PDF. Please upload the document as a high-resolution image (PNG/JPG) for better results.'
            }),
            {
              status: 422,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Step 2: Use the text quality classifier
        console.log('Running text quality classification...');
        const classifierMessages = [
          {
            role: 'system',
            content: `You are a PDF-text quality evaluator.  
Your job is to inspect a block of extracted text and decide whether it is:

1. **Garbage PDF syntax** (raw object streams, filters, binary keywords like FlateDecode, XObject, BitsPerComponent, etc.),  
2. **Human-readable text** (actual words, sentences, numeric values like "Basic Salary: 45,000 SAR", etc.).

Output **only** a JSON object with these three fields:
{
  "is_garbage": <boolean>,
  "reason": "<very brief justification>",
  "sample_excerpt": "<a 200-character snippet from the text that best illustrates your decision>"
}

Do not output anything else.`
          },
          {
            role: 'user',
            content: `Please evaluate the following extracted text block and classify it:

\`\`\`
${textContent}
\`\`\``
          }
        ];

        const classifierResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: classifierMessages,
            temperature: 0.1
          }),
        });

        if (!classifierResponse.ok) {
          throw new Error(`Text classifier failed: ${classifierResponse.statusText}`);
        }

        const classifierData = await classifierResponse.json();
        const classification: TextQualityClassification = JSON.parse(classifierData.choices[0].message.content);
        
        console.log('Text quality classification:', classification);
        
        // Step 3: Handle garbage text with error message
        if (classification.is_garbage) {
          console.log('PDF text classified as garbage, cannot process with current method');
          
          // Update document with structured error
          await supabase
            .from('document_uploads')
            .update({
              processing_status: 'failed',
              error_message: `PDF text extraction failed: ${classification.reason}`
            })
            .eq('id', documentId);

          return new Response(
            JSON.stringify({
              success: false,
              error: 'UNREADABLE_PDF',
              message: `PDF text extraction failed: ${classification.reason}. Please upload the document as a high-resolution image (PNG/JPG) for better results.`,
              details: {
                reason: classification.reason,
                sample_excerpt: classification.sample_excerpt
              }
            }),
            {
              status: 422,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log('Text quality approved, proceeding with salary extraction');
        
      } catch (error) {
        console.error('PDF text extraction failed:', error);
        
        // Update document with error
        await supabase
          .from('document_uploads')
          .update({
            processing_status: 'failed',
            error_message: 'Failed to extract readable text from PDF'
          })
          .eq('id', documentId);

        return new Response(
          JSON.stringify({
            success: false,
            error: 'UNREADABLE_PDF',
            message: 'Failed to extract readable text from PDF. Please upload the document as a high-resolution image (PNG/JPG) for better results.'
          }),
          {
            status: 422,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Step 4: Proceed with salary extraction using the validated text
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

      // Define functions for the older OpenAI function calling format
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

      // Use the older function calling format
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
      // For images, use Vision API directly
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
