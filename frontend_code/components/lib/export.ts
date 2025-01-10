import { Editor } from "@tiptap/react";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from "docx";
import html2canvas from "html2canvas";

export const exportToPdf = async (editor: Editor) => {
  try {
    const editorElement = document.querySelector(".ProseMirror") as HTMLElement;
    if (!editorElement) throw new Error("Editor element not found");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;

    // Text styles with appropriate spacing
    const styles = {
      section: {
        fontSize: 11,
        lineHeight: 1.2,
        spaceBefore: 12,
        spaceAfter: 4,
      },
      title: {
        fontSize: 14,
        lineHeight: 1.3,
        spaceBefore: 16,
        spaceAfter: 12,
        bold: true,
      },
      heading: {
        fontSize: 12,
        lineHeight: 1.3,
        spaceBefore: 14,
        spaceAfter: 8,
        bold: true,
      },
      paragraph: {
        fontSize: 11,
        lineHeight: 1.4,
        spaceBefore: 6,
        spaceAfter: 10,
      },
    };

    let currentY = margin;

    const renderParagraph = (text: string, style: any = styles.paragraph) => {
      pdf.setFontSize(style.fontSize);
      pdf.setFont("helvetica", style.bold ? "bold" : "normal");

      // Split text into words to handle proper wrapping
      const words = text.trim().split(/\s+/);
      let currentLine = "";
      const lines = [];

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = pdf.getStringUnitWidth(testLine) * style.fontSize;

        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }

      // Add spacing before paragraph
      currentY += style.spaceBefore;

      // Render each line
      lines.forEach((line) => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += style.fontSize * style.lineHeight;
      });

      // Add spacing after paragraph
      currentY += style.spaceAfter;
    };

    const processNode = (node: HTMLElement) => {
      const nodeType = node.nodeName.toLowerCase();
      const text = node.textContent?.trim() || "";

      switch (nodeType) {
        case "h1":
          renderParagraph(text, styles.title);
          break;
        case "h2":
          renderParagraph(text, styles.heading);
          break;
        case "h3":
          renderParagraph(text, styles.heading);
          break;
        case "p":
          // Check if this paragraph is a section header
          if (node.textContent?.includes("Section")) {
            renderParagraph(text, styles.section);
          } else {
            // Handle specific text patterns
            const lines = text.split(/\n|(?<=\.)(?=\s)/);
            lines.forEach((line) => {
              if (line.trim()) {
                // Check if line starts with a key term
                if (line.includes(":")) {
                  const [term, definition] = line.split(":");
                  if (term && definition) {
                    // Render term in bold
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(styles.paragraph.fontSize);
                    pdf.text(term.trim() + ":", margin, currentY);

                    // Render definition in normal font
                    pdf.setFont("helvetica", "normal");
                    renderParagraph(definition.trim(), {
                      ...styles.paragraph,
                      spaceBefore: 2,
                      spaceAfter: 6,
                    });
                  }
                } else {
                  renderParagraph(line.trim());
                }
              }
            });
          }
          break;
        default:
          if (text) {
            renderParagraph(text);
          }
      }
    };

    // Process all content recursively
    const processContent = (element: HTMLElement) => {
      Array.from(element.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          processNode(node as HTMLElement);
        }
      });
    };

    processContent(editorElement);
    pdf.save("document.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
};

export const exportToDocx = async (editor: Editor) => {
  try {
    const content = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const children: any[] = [];

    // Process nodes recursively
    const processNode = async (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent?.trim()) {
          return new TextRun({
            text: node.textContent,
            bold: hasParentWithTag(node, "strong"),
            italics: hasParentWithTag(node, "em"),
            highlight: getHighlightColor(node),
          });
        }
        return null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);
        const tagName = element.tagName.toLowerCase();

        // Handle different element types
        switch (tagName) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6": {
            const level = parseInt(tagName.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
            const runs = await processChildNodes(node);
            return new Paragraph({
              children: runs,
              heading: HeadingLevel[`HEADING_${level}`],
              spacing: { before: 240, after: 120 },
            });
          }

          case "p": {
            const runs = await processChildNodes(node);
            return new Paragraph({
              children: runs,
              spacing: { before: 120, after: 120 },
              alignment: getAlignment(style.textAlign),
            });
          }

          case "pre": {
            const runs = await processChildNodes(node);
            return new Paragraph({
              children: runs,
              spacing: { before: 240, after: 240 },
              style: "Code",
            });
          }

          case "img": {
            const imgElement = element as HTMLImageElement;
            try {
              const response = await fetch(imgElement.src);
              const blob = await response.blob();
              const buffer = await blob.arrayBuffer();
              return new Paragraph({
                children: [
                  new ImageRun({
                    data: buffer,
                    transformation: {
                      width: 400,
                      height: 300,
                    },
                  }),
                ],
                spacing: { before: 240, after: 240 },
              });
            } catch (error) {
              console.error("Error processing image:", error);
              return null;
            }
          }

          default: {
            const runs = await processChildNodes(node);
            return runs;
          }
        }
      }

      return null;
    };

    const processChildNodes = async (node: Node) => {
      const results = [];
      for (const child of Array.from(node.childNodes)) {
        const result = await processNode(child);
        if (result) {
          if (Array.isArray(result)) {
            results.push(...result);
          } else {
            results.push(result);
          }
        }
      }
      return results;
    };

    // Helper functions
    const hasParentWithTag = (node: Node, tagName: string): boolean => {
      let parent = node.parentElement;
      while (parent) {
        if (parent.tagName.toLowerCase() === tagName) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    };

    const getHighlightColor = (node: Node): string | undefined => {
      let parent = node.parentElement;
      while (parent) {
        if (parent.hasAttribute("data-color")) {
          return parent.getAttribute("data-color") || undefined;
        }
        parent = parent.parentElement;
      }
      return undefined;
    };

    const getAlignment = (textAlign: string): AlignmentType => {
      switch (textAlign) {
        case "right":
          return AlignmentType.RIGHT;
        case "center":
          return AlignmentType.CENTER;
        case "justify":
          return AlignmentType.JUSTIFIED;
        default:
          return AlignmentType.LEFT;
      }
    };

    // Process all nodes
    const processedNodes = await processChildNodes(doc.body);

    // Create and save document
    const docx = new Document({
      sections: [
        {
          properties: {},
          children: processedNodes.flat(),
        },
      ],
      styles: {
        paragraphStyles: [
          {
            id: "Code",
            name: "Code",
            basedOn: "Normal",
            run: {
              font: "Courier New",
              size: 20,
            },
            paragraph: {
              spacing: { before: 240, after: 240 },
              indent: { left: 720 },
            },
          },
        ],
      },
    });

    const blob = await Packer.toBlob(docx);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.docx";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    alert("Error generating DOCX. Please try again.");
  }
};
