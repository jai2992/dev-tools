import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Helper function to convert Uint8Array to proper ArrayBuffer
function uint8ArrayToArrayBuffer(array: Uint8Array): ArrayBuffer {
  return array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength) as ArrayBuffer;
}

// PDF to Word conversion
export async function convertPdfToWord(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  
  // Note: This is a simplified implementation. For production use, consider:
  // - Using PDF.js for better text extraction
  // - PDF2Text libraries for accurate text extraction
  // - Server-side conversion services for complex documents
  
  let extractedText = `Document: ${file.name}\nConverted from PDF to Word format\n\n`;
  
  try {
    // Attempt basic text extraction (limited functionality)
    for (let i = 0; i < pageCount; i++) {
      extractedText += `\n--- Page ${i + 1} ---\n`;
      // PDF-lib doesn't provide text extraction capabilities
      // In a real implementation, you would use PDF.js or similar
      extractedText += `[Text content from page ${i + 1} would be extracted here using a proper PDF text extraction library]\n`;
    }
    
    extractedText += `\n\nNote: This is a basic conversion. For accurate text extraction with formatting, 
consider using specialized PDF processing libraries or server-side conversion services.`;
    
  } catch (error) {
    extractedText += 'Error extracting text from PDF. File may be image-based or encrypted.';
  }
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: extractedText,
              font: "Arial",
              size: 24,
            }),
          ],
        }),
      ],
    }],
  });
  
  const buffer = await Packer.toBuffer(doc);
  return new Blob([new Uint8Array(buffer)], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
}

// PDF to Excel conversion
export async function convertPdfToExcel(file: File): Promise<Blob> {
  // Note: Real PDF table extraction requires specialized libraries like:
  // - Tabula-js for table extraction
  // - PDF.js for text parsing with position detection
  // - Server-side solutions for complex table recognition
  
  const workbook = XLSX.utils.book_new();
  
  const headerData = [
    ['PDF to Excel Conversion - ' + file.name],
    [''],
    ['Note: This is a basic conversion demonstration'],
    ['For accurate table extraction from PDFs, consider using:'],
    ['• Tabula or similar table extraction tools'],
    ['• PDF.js with custom parsing logic'],
    ['• Server-side PDF processing services'],
    [''],
    ['File Information:'],
    ['Original filename', file.name],
    ['File size', `${(file.size / (1024 * 1024)).toFixed(2)} MB`],
    ['Conversion date', new Date().toLocaleDateString()],
    [''],
    ['Sample Data Structure:'],
    ['Column A', 'Column B', 'Column C', 'Column D'],
    ['Data 1', 'Data 2', 'Data 3', 'Data 4'],
    ['More data would be extracted from PDF tables here']
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(headerData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Converted Data');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

// Word to PDF conversion
export async function convertWordToPdf(file: File): Promise<Blob> {
  // Note: Converting Word to PDF in the browser is complex and limited.
  // For production use, consider:
  // - Server-side conversion with LibreOffice/Pandoc
  // - Cloud services like Google Drive API or Microsoft Graph API
  // - Dedicated conversion services
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  // Basic document information
  page.drawText('Word to PDF Conversion', {
    x: 50,
    y: 750,
    size: 16,
  });
  
  page.drawText(`Original file: ${file.name}`, {
    x: 50,
    y: 720,
    size: 12,
  });
  
  page.drawText(`File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, {
    x: 50,
    y: 700,
    size: 12,
  });
  
  page.drawText(`Converted on: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 680,
    size: 12,
  });
  
  // Limitation notice
  const noticeText = [
    '',
    'Note: This is a basic conversion demonstration.',
    'Full Word document conversion requires:',
    '',
    '• Text extraction from .docx files',
    '• Formatting preservation (fonts, styles, layouts)',
    '• Image and table handling',
    '• Header/footer processing',
    '',
    'For production use, implement server-side conversion',
    'or use specialized document processing services.'
  ];
  
  noticeText.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: 640 - (index * 20),
      size: 10,
    });
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
}

// Excel to PDF conversion
export async function convertExcelToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  page.drawText('Excel Data Converted to PDF', {
    x: 50,
    y: 750,
    size: 16,
  });
  
  // Convert sheet data to text and add to PDF
  const sheetData = XLSX.utils.sheet_to_csv(worksheet);
  const lines = sheetData.split('\n').slice(0, 30); // Limit lines
  
  lines.forEach((line, index) => {
    page.drawText(line.substring(0, 60), { // Limit line length
      x: 50,
      y: 700 - (index * 20),
      size: 8,
    });
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
}

// PDF Merger
export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
}

// PDF Splitter
export async function splitPdf(file: File, pageRanges: Array<{start: number, end: number}>): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const results: Blob[] = [];
  
  for (const range of pageRanges) {
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, Array.from(
      {length: range.end - range.start + 1}, 
      (_, i) => range.start + i
    ));
    pages.forEach(page => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    results.push(new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' }));
  }
  
  return results;
}

// PDF Compressor
export async function compressPdf(file: File, quality: number = 0.7): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Note: True PDF compression requires advanced techniques:
  // - Image compression and resampling
  // - Font subsetting and optimization
  // - Object stream compression
  // - Removal of metadata and unused objects
  
  // This implementation provides basic optimization
  const pdfBytes = await pdf.save({
    useObjectStreams: true, // Enable object streams for better compression
    addDefaultPage: false,
    updateFieldAppearances: false,
  });
  
  // Calculate compression ratio for user feedback
  const originalSize = file.size;
  const compressedSize = pdfBytes.length;
  const compressionRatio = ((originalSize - compressedSize) / originalSize * 100);
  
  // Add compression info to console for debugging
  console.log(`PDF Compression: ${compressionRatio.toFixed(1)}% size reduction`);
  console.log(`Original: ${(originalSize / 1024).toFixed(1)}KB -> Compressed: ${(compressedSize / 1024).toFixed(1)}KB`);
  
  return new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
}

// PDF Page Extractor
export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const pages = await newPdf.copyPages(pdf, pageNumbers.map(n => n - 1)); // Convert to 0-indexed
  pages.forEach(page => newPdf.addPage(page));
  
  const pdfBytes = await newPdf.save();
  return new Blob([uint8ArrayToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
}

// Download helper
export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}
