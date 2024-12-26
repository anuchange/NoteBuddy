import { Editor } from '@tiptap/react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

export const exportToPdf = async (editor: Editor) => {
  const content = editor.getHTML();
  const doc = new jsPDF();
  
  // Remove HTML tags for plain text
  const text = content.replace(/<[^>]*>/g, '');
  
  doc.text(text, 10, 10);
  doc.save('document.pdf');
};

export const exportToDocx = async (editor: Editor) => {
  const content = editor.getHTML();
  
  // Create document with basic content
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: content.replace(/<[^>]*>/g, ''),
        }),
      ],
    }],
  });

  // Generate and download the file
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.docx';
  a.click();
  window.URL.revokeObjectURL(url);
};