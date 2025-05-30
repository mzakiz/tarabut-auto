
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

interface ExtractedData {
  monthly_gross_salary?: number;
  basic_salary?: number;
  allowances?: number;
  total_deductions?: number;
  net_salary?: number;
  currency: string;
  employee_name?: string;
  company_name?: string;
  monthly_salary_deposits?: Array<{
    amount: number;
    date: string;
    description: string;
  }>;
  average_monthly_income?: number;
  account_holder_name?: string;
  bank_name?: string;
  confidence_score: number;
}

// Helper function for chunked base64 conversion
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // 8KB chunks
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    result += String.fromCharCode(...chunk);
  }
  
  return btoa(result);
}

// OCR processing for PDFs
async function extractTextFromPDF(pdfBuffer: Uint8Array, apiKey: string): Promise<string> {
  console.log('Starting PDF text extraction');
  
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    console.log(`PDF has ${pageCount} pages`);
    
    const extractedTexts: string[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      console.log(`Processing page ${i + 1}/${pageCount}`);
      
      try {
        // Create single page PDF
        const singlePageDoc = await PDFDocument.create();
        const [page] = await singlePageDoc.copyPages(pdfDoc, [i]);
        singlePageDoc.addPage(page);
        const pageBuffer = await singlePageDoc.save();
        
        // Convert to base64
        const base64 = toBase64(pageBuffer.buffer);
        
        // OCR the page
        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            'apikey': apiKey,
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

        if (response.ok) {
          const result = await response.json();
          const pageText = result.ParsedResults?.[0]?.ParsedText || '';
          extractedTexts.push(pageText);
          console.log(`Page ${i + 1} extracted ${pageText.length} characters`);
        } else {
          console.warn(`OCR failed for page ${i + 1}: ${response.status}`);
          extractedTexts.push('');
        }
      } catch (pageError) {
        console.error(`Error processing page ${i + 1}:`, pageError);
        extractedTexts.push('');
      }
    }
    
    const fullText = extractedTexts.join('\n').trim();
    console.log(`Total extracted text: ${fullText.length} characters`);
    
    if (fullText.length < 50) {
      throw new Error('Insufficient text extracted from PDF');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
}

// OCR processing for images
async function extractTextFromImage(imageBuffer: ArrayBuffer, apiKey: string, mimeType: string): Promise<string> {
  console.log('Starting image text extraction');
  
  try {
    const base64 = toBase64(imageBuffer);
    
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image: `data:${mimeType};base64,${base64}`,
        language: 'eng',
        isTable: true,
        detectOrientation: true,
        scale: true,
        OCREngine: 2
      }),
    });

    if (!response.ok) {
      throw new Error(`OCR API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const extractedText = result.ParsedResults?.[0]?.ParsedText || '';
    
    if (extractedText.length < 20) {
      throw new Error('Insufficient text extracted from image');
    }
    
    console.log(`Extracted ${extractedText.length} characters from image`);
    return extractedText;
  } catch (error) {
    console.error('Image text extraction failed:', error);
    throw new Error(`Image OCR failed: ${error.message}`);
  }
}

// AI analysis using OpenAI
async function analyzeWithOpenAI(
  content: string | ArrayBuffer,
  documentType: string,
  apiKey: string,
  isImage: boolean = false,
  mimeType?: string
): Promise<ExtractedData> {
  console.log('Starting OpenAI analysis');
  
  const systemMessage = documentType === 'salary_certificate' 
    ? 'Extract salary information from this document. Look for salary amounts, allowances, deductions, and employee details.'
    : 'Extract salary-related transactions from this bank statement. Look for recurring deposits that appear to be salary payments.';

  const functionName = documentType === 'salary_certificate' ? 'extract_salary_data' : 'extract_bank_data';
  
  const functionSchema = documentType === 'salary_certificate' ? {
    name: "extract_salary_data",
    description: "Extract structured salary data",
    parameters: {
      type: "object",
      properties: {
        monthly_gross_salary: { type: "number", description: "Monthly gross salary" },
        basic_salary: { type: "number", description: "Basic salary" },
        allowances: { type: "number", description: "Total allowances" },
        total_deductions: { type: "number", description: "Total deductions" },
        net_salary: { type: "number", description: "Net salary" },
        currency: { type: "string", description: "Currency code" },
        employee_name: { type: "string", description: "Employee name" },
        company_name: { type: "string", description: "Company name" },
        confidence_score: { type: "number", description: "Confidence 0-1" }
      },
      required: ["currency", "confidence_score"]
    }
  } : {
    name: "extract_bank_data",
    description: "Extract structured bank statement data",
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
        currency: { type: "string", description: "Currency code" },
        account_holder_name: { type: "string", description: "Account holder" },
        bank_name: { type: "string", description: "Bank name" },
        confidence_score: { type: "number", description: "Confidence 0-1" }
      },
      required: ["currency", "confidence_score"]
    }
  };

  let messages;
  if (isImage && content instanceof ArrayBuffer) {
    const base64 = toBase64(content);
    messages = [
      { role: 'system', content: systemMessage },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Analyze this ${documentType.replace('_', ' ')} image:` },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
              detail: 'high'
            }
          }
        ]
      }
    ];
  } else {
    messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: `Analyze this ${documentType.replace('_', ' ')} text:\n\n${content}` }
    ];
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        functions: [functionSchema],
        function_call: { name: functionName },
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const functionCall = result.choices[0].message.function_call;
    
    if (!functionCall?.arguments) {
      throw new Error('No structured data extracted');
    }

    const extractedData = JSON.parse(functionCall.arguments) as ExtractedData;
    console.log('OpenAI analysis completed successfully');
    
    return extractedData;
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

// Update document status in database
async function updateDocumentStatus(
  supabase: any,
  documentId: string,
  status: string,
  extractedData?: ExtractedData,
  errorMessage?: string
) {
  const updateData: any = {
    processing_status: status,
    processed_at: new Date().toISOString()
  };

  if (extractedData) {
    updateData.extracted_data = extractedData;
    updateData.confidence_score = extractedData.confidence_score;
  }

  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  const { error } = await supabase
    .from('document_uploads')
    .update(updateData)
    .eq('id', documentId);

  if (error) {
    console.error('Failed to update document status:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: DocumentAnalysisRequest;
  
  try {
    console.log('=== Document Analysis Started ===');
    
    requestBody = await req.json();
    const { documentId, fileUrl, documentType } = requestBody;
    
    // Validate input
    if (!documentId || !fileUrl || !documentType) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: documentId, fileUrl, or documentType'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check API keys
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    const ocrKey = Deno.env.get('OCR_SPACE_API_KEY');
    
    if (!openAIKey || !ocrKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'API keys not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Supabase configuration missing'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to processing
    await updateDocumentStatus(supabase, documentId, 'processing');

    // Download file
    console.log('Downloading file...');
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      await updateDocumentStatus(supabase, documentId, 'failed', undefined, `File download failed: ${fileResponse.statusText}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File download failed'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const fileBlob = await fileResponse.blob();
    const fileExtension = new URL(fileUrl).pathname.split('.').pop()?.toLowerCase();
    
    // File size check (10MB limit)
    if (fileBlob.size > 10 * 1024 * 1024) {
      await updateDocumentStatus(supabase, documentId, 'failed', undefined, 'File too large (max 10MB)');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        }),
        {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let extractedData: ExtractedData;
    const arrayBuffer = await fileBlob.arrayBuffer();

    if (fileExtension === 'pdf') {
      // Process PDF with OCR
      const extractedText = await extractTextFromPDF(new Uint8Array(arrayBuffer), ocrKey);
      extractedData = await analyzeWithOpenAI(extractedText, documentType, openAIKey);
    } else {
      // Process image directly with Vision API
      extractedData = await analyzeWithOpenAI(arrayBuffer, documentType, openAIKey, true, fileBlob.type);
    }

    // Update document with results
    await updateDocumentStatus(supabase, documentId, 'completed', extractedData);

    console.log('=== Document Analysis Completed ===');
    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        extractedData,
        confidenceScore: extractedData.confidence_score
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Document analysis error:', error);
    
    // Update document status if we have the ID
    if (requestBody?.documentId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        await updateDocumentStatus(supabase, requestBody.documentId, 'failed', undefined, error.message);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
