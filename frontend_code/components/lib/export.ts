import { Editor } from '@tiptap/react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { parseEditorContent } from './parseEditorContent';

export const exportToPdf = async (editor: Editor) => {
  const content = editor.getHTML();
  const doc = new jsPDF();
  const parsedContent = parseEditorContent(content);
  
  let y = 20; // Starting y position
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  
  parsedContent.forEach(({ text, fontSize, alignment, isCode }) => {
    doc.setFontSize(fontSize);
    
    if (isCode) {
      doc.setFont('Courier', 'normal');
    } else {
      doc.setFont('Helvetica', 'normal');
    }
    
    // Handle text alignment
    const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
    let x = margin;
    
    if (alignment === AlignmentType.CENTER) {
      x = (pageWidth - textWidth) / 2;
    } else if (alignment === AlignmentType.RIGHT) {
      x = pageWidth - textWidth - margin;
    }
    
    doc.text(text, x, y);
    y += fontSize + 10;
  });
  
  doc.save('document.pdf');
};

export const exportToDocx = async (editor: Editor) => {
  const content = editor.getHTML();
  const parsedContent = parseEditorContent(content);
  
  const children = parsedContent.map(({ text, headingLevel, alignment, isCode, isBold, isItalic }) => {
    return new Paragraph({
      heading: headingLevel ? {
        level: headingLevel,
        style: `Heading${headingLevel}`
      } : undefined,
      alignment,
      children: [
        new TextRun({
          text,
          bold: isBold,
          italics: isItalic,
          font: isCode ? 'Courier New' : 'Arial',
        }),
      ],
    });
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.docx';
  a.click();
  window.URL.revokeObjectURL(url);
};