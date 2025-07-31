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
  
  let extractedText = '';
  
  // This is a simplified text extraction
  // In a real implementation, you'd use PDF.js for better text extraction
  for (let i = 0; i < pageCount; i++) {
    extractedText += `Page ${i + 1}\n\n`;
    // Add placeholder text extraction logic here
    extractedText += 'Text extracted from PDF page...\n\n';
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
  // Simplified implementation - in reality, you'd extract tables from PDF
  const workbook = XLSX.utils.book_new();
  
  const sampleData = [
    ['Data extracted from PDF', '', ''],
    ['Column 1', 'Column 2', 'Column 3'],
    ['Row 1 Data', 'Row 1 Data', 'Row 1 Data'],
    ['Row 2 Data', 'Row 2 Data', 'Row 2 Data'],
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

// Word to PDF conversion
export async function convertWordToPdf(_file: File): Promise<Blob> {
  // This is a placeholder implementation
  // Real implementation would require server-side conversion or a different approach
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  page.drawText('Converted from Word document: ' + _file.name, {
    x: 50,
    y: 750,
    size: 12,
  });
  
  page.drawText('Content would be extracted and converted here...', {
    x: 50,
    y: 700,
    size: 10,
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
export async function compressPdf(file: File, _quality: number = 0.7): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // This is a simplified compression - real implementation would involve image compression
  const pdfBytes = await pdf.save({
    useObjectStreams: false,
  });
  
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
