
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

interface PdfToImageResult {
  images: string[];
  pageCount: number;
}

export const usePdfToImage = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  const convertPdfToImages = async (file: File, maxPages: number = 3): Promise<PdfToImageResult> => {
    setIsConverting(true);
    setConversionProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      const pagesToProcess = Math.min(pageCount, maxPages);
      
      console.log(`Converting PDF: ${pagesToProcess} pages to process out of ${pageCount} total`);

      const images: string[] = [];

      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) {
          throw new Error('Could not get canvas context');
        }

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to base64 PNG
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1]; // Remove data:image/png;base64, prefix
        images.push(base64Data);

        // Update progress
        const progress = (pageNum / pagesToProcess) * 100;
        setConversionProgress(progress);
        
        console.log(`Converted page ${pageNum}/${pagesToProcess}`);
      }

      console.log(`PDF conversion completed: ${images.length} images generated`);
      
      return {
        images,
        pageCount
      };

    } catch (error) {
      console.error('PDF to image conversion failed:', error);
      throw new Error(`Failed to convert PDF to images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  return {
    convertPdfToImages,
    isConverting,
    conversionProgress
  };
};
