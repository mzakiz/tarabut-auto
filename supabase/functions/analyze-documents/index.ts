

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { PDFDocument } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentAnalysisRequest {
  documentId: string;
  fileUrl: string;
  documentType: 'salary_certificate' | 'bank_statement';
}

// Split PDF into individual pages
async function splitPdf(buffer: Uint8Array): Promise<Uint8Array[]> {
  try {
    const src = await PDFDocument.load(buffer);
    const total = src.getPageCount();
    const pages: Uint8Array[] = [];
    
    console.log(`Splitting PDF into ${total} pages`);
    
    for (let i = 0; i < total; i++) {
      const dst = await PDFDocument.create();
      const [page] = await dst.copyPages(src, [i]);
      dst.addPage(page);
      pages.push(await dst.save());
    }
    
    return pages;
  } catch (error) {
    console.error('PDF splitting error:', error);
    throw new Error(`Failed to split PDF: ${error.message}`);
  }
}

// Call OCR.space for each page individually
async function callOcrSpacePerPage(pages: Uint8Array[], ocrApiKey: string): Promise<string> {
  const texts: string[] = [];
  
  console.log(`Processing ${pages.length} pages with OCR.space`);
  
  for (let i = 0; i < pages.length; i++) {
    console.log(`Processing page ${i + 1}/${pages.length}`);
    
    try {
      const pdfBytes = pages[i];
      const base64 = btoa(String.fromCharCode(...pdfBytes));
      
      const resp = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': ocrApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Image: `data:application/pdf;base64,${base64}`,
          language: 'eng',
          isTable: true,
          detectOrientation: true,
          scale: true,
          OCREngine: 2
        }),
      });

      if (!resp.ok) {
        console.warn(`OCR failed for page ${i + 1}: ${resp.status} ${resp.statusText}`);
        texts.push(''); // Add empty text for failed pages
        continue;
      }

      const json = await resp.json();
      const pageText = json.ParsedResults?.[0]?.ParsedText || '';
      texts.push(pageText);
      
      console.log(`Page ${i + 1} extracted ${pageText.length} characters`);
    } catch (pageError) {
      console.error(`Error processing page ${i + 1}:`, pageError);
      texts.push(''); // Add empty text for failed pages
    }
  }
  
  const finalText = texts.join('\n');
  console.log(`Total extracted text length: ${finalText.length}`);
  
  return finalText;
}

// OCR.space fallback function for images
async function callOcrSpaceImage(buffer: ArrayBuffer, ocrApiKey: string) {
  try {
    const uint8Array = new Uint8Array(buffer);
    const base64Data = btoa(String.fromCharCode(...uint8Array));
    
    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': ocrApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image: `data:image/jpeg;base64,${base64Data}`,
        language: 'eng',
        isTable: true,
        detectOrientation: true,
        scale: true,
        OCREngine: 2
      }),
    });

    if (!ocrResponse.ok) {
      throw new Error(`OCR.space API error: ${ocrResponse.status} ${ocrResponse.statusText}`);
    }

    const ocrData = await ocrResponse.json();
    console.log('OCR.space response:', JSON.stringify(ocrData, null, 2));
    
    if (ocrData.ParsedResults && ocrData.ParsedResults.length > 0) {
      return ocrData.ParsedResults[0].ParsedText || '';
    }
    
    throw new Error('OCR.space returned no results');
  } catch (error) {
    console.error('OCR.space error details:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: DocumentAnalysisRequest;
  
  try {
    requestBody = await req.json() as DocumentAnalysisRequest;
    const { documentId, fileUrl, documentType } = requestBody;
    
    console.log('Processing document:', { documentId, documentType, hasFileUrl: !!fileUrl });
    
    // Check if required API keys are available
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const ocrSpaceKey = Deno.env.get('OCR_SPACE_API_KEY');
    if (!ocrSpaceKey) {
      throw new Error('OCR.space API key is not configured');
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

    let extractedData;
    let processingMethod = 'vision_api';

    // Handle file processing
    const urlParams = new URL(fileUrl);
    const filePath = urlParams.pathname;
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    console.log('File extension detected:', fileExtension);

    const supportedFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'];
    if (!supportedFormats.includes(fileExtension || '')) {
      throw new Error('Unsupported file format. Please upload PDF, PNG, JPG, JPEG, GIF, or WEBP files.');
    }

    console.log('Fetching file from storage...');
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    
    const fileBlob = await fileResponse.blob();
    
    // File size guardrail - reject files larger than 5MB
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (fileBlob.size > maxFileSize) {
      console.log(`File too large: ${fileBlob.size} bytes (max: ${maxFileSize})`);
      
      await supabase
        .from('document_uploads')
        .update({
          processing_status: 'failed',
          error_message: 'File too large. Please upload a file smaller than 5MB or use an image format.'
        })
        .eq('id', documentId);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: 'File is too large. Please upload a file smaller than 5MB or convert your document to a high-quality image (PNG/JPG).'
        }),
        {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Analyzing document...');
    
    if (fileExtension === 'pdf') {
      console.log('Processing PDF file with page-by-page OCR...');
      
      let finalText = '';
      
      try {
        // For PDFs, split into pages and process each with OCR.space
        const arrayBuffer = await fileBlob.arrayBuffer();
        const uint8Buffer = new Uint8Array(arrayBuffer);
        
        const pages = await splitPdf(uint8Buffer);
        finalText = await callOcrSpacePerPage(pages, ocrSpaceKey);
        processingMethod = 'ocr_extraction';
        console.log(`OCR extraction successful, text length: ${finalText.length}`);
        
      } catch (ocrError) {
        console.error('OCR extraction failed:', ocrError);
        
        await supabase
          .from('document_uploads')
          .update({
            processing_status: 'failed',
            error_message: `OCR processing failed: ${ocrError.message}`
          })
          .eq('id', documentId);

        return new Response(
          JSON.stringify({
            success: false,
            error: 'OCR_FAILED',
            message: 'We couldn\'t process your PDF. Please try uploading it as a high-quality image (PNG/JPG) instead.'
          }),
          {
            status: 422,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (!finalText || finalText.trim().length < 20) {
        await supabase
          .from('document_uploads')
          .update({
            processing_status: 'failed',
            error_message: 'Unable to extract readable text from PDF'
          })
          .eq('id', documentId);

        return new Response(
          JSON.stringify({
            success: false,
            error: 'UNABLE_TO_EXTRACT_TEXT',
            message: 'We couldn\'t read your PDF. Please upload a clear image of your salary certificate.'
          }),
          {
            status: 422,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Proceed with AI analysis using the extracted text
      const systemMessage = documentType === 'salary_certificate' 
        ? `You are an assistant that extracts salary information from a salary certificate text. 
           Look for salary amounts, basic pay, allowances, deductions, and net pay.
           Respond ONLY with a function call to extract_salary_data.`
        : `You are an assistant that extracts salary-related transactions from bank statement text.
           Look for recurring deposits that appear to be salary payments.
           Respond ONLY with a function call to extract_bank_data.`;

      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Please analyze this ${documentType.replace('_', ' ')} text and extract the information:\n\n${finalText.substring(0, 8000)}` }
      ];

      // Define functions for extraction
      const functions = documentType === 'salary_certificate' ? [{
        name: "extract_salary_data",
        description: "Extract structured salary data from a salary certificate",
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
            average_monthly_income: { type: "number", description: "Average monthly income" },
            currency: { type: "string", description: "Currency code (e.g., SAR)" },
            account_holder_name: { type: "string", description: "Account holder name" },
            bank_name: { type: "string", description: "Bank name" },
            confidence_score: { type: "number", description: "Confidence score between 0 and 1" }
          },
          required: ["currency", "confidence_score"]
        }
      }];

      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call && responseMessage.function_call.arguments) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log(`Extracted data using ${processingMethod}:`, extractedData);
      } else {
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

      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
      const responseMessage = analysisData.choices[0].message;
      
      if (responseMessage.function_call && responseMessage.function_call.arguments) {
        extractedData = JSON.parse(responseMessage.function_call.arguments);
        console.log('Extracted data from image:', extractedData);
      } else {
        throw new Error('Failed to extract structured data from document image');
      }
    }

    const confidenceScore = extractedData.confidence_score || 0.5;
    
    console.log('Document analysis completed successfully with confidence:', confidenceScore);

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
        confidenceScore,
        processingMethod
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

