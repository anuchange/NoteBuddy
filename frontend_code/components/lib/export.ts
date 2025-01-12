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
    if (!editorElement) {
      throw new Error("Editor element not found");
    }

    // Create a temporary container with A4 dimensions
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "210mm"; // A4 width
    tempContainer.style.backgroundColor = "white";
    document.body.appendChild(tempContainer);

    // Clone and prepare content for high-quality capture
    const clonedElement = editorElement.cloneNode(true) as HTMLElement;
    clonedElement.style.width = "170mm"; // Content width (A4 - margins)
    clonedElement.style.margin = "0";
    clonedElement.style.padding = "0";
    clonedElement.style.height = "auto";
    tempContainer.appendChild(clonedElement);

    // Process and optimize SVG elements
    const svgElements = clonedElement.getElementsByTagName("svg");
    for (const svg of Array.from(svgElements)) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngData = canvas.toDataURL("image/png");
          const newImg = document.createElement("img");
          newImg.src = pngData;
          newImg.style.width = svg.style.width;
          newImg.style.height = svg.style.height;
          svg.parentNode?.replaceChild(newImg, svg);
          resolve(null);
        };
      });
    }

    // Wait for all resources to load
    await document.fonts.ready;
    const images = Array.from(clonedElement.getElementsByTagName("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // PDF dimensions and settings
    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm
    const margin = 20; // mm
    const contentWidth = pdfWidth - 2 * margin;
    const pageHeight = pdfHeight - 2 * margin; // Available content height per page

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    clonedElement.querySelectorAll("*").forEach((el) => {
      console.log("Element:", el);
      console.log("Element tag:", el.tagName);
      console.log("");

      // Skip the CODE tag and its descendants
      let currentElement = el;
      while (currentElement) {
        if (currentElement.tagName.toUpperCase() === "CODE") {
          return; // Skip this element and its descendants
        }
        currentElement = currentElement.parentElement;
      }

      // Apply color only if not inside a CODE block
      (el as HTMLElement).style.color = "#000000";
    });

    // Render the canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const totalHeightInMM = (canvas.height / canvas.width) * contentWidth; // Convert px height to mm
    let remainingHeight = totalHeightInMM; // Keep track of remaining height
    let yOffset = 0; // Y-offset for each page

    while (remainingHeight > 0) {
      const canvasPage = document.createElement("canvas");
      const pageCanvasHeight = Math.min(
        canvas.height,
        Math.floor((pageHeight / totalHeightInMM) * canvas.height)
      );

      canvasPage.width = canvas.width;
      canvasPage.height = pageCanvasHeight;

      const ctx = canvasPage.getContext("2d")!;
      ctx.drawImage(
        canvas,
        0,
        yOffset, // Start drawing from the current offset
        canvas.width,
        pageCanvasHeight,
        0,
        0,
        canvasPage.width,
        canvasPage.height
      );

      const pageImage = canvasPage.toDataURL("image/png");
      pdf.addImage(pageImage, "PNG", margin, margin, contentWidth, pageHeight);

      remainingHeight -= pageHeight;
      yOffset += pageCanvasHeight;

      if (remainingHeight > 0) pdf.addPage(); // Add a new page if there's remaining content
    }

    // Clean up
    document.body.removeChild(tempContainer);

    // Save the PDF
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

    // const getAlignment = (textAlign: string): typeof AlignmentType => {
    //   switch (textAlign) {
    //     case "right":
    //       return AlignmentType.RIGHT;
    //     case "center":
    //       return AlignmentType.CENTER;
    //     case "justify":
    //       return AlignmentType.JUSTIFIED;
    //     default:
    //       return AlignmentType.LEFT;
    //   }
    // };

    const getAlignment = (textAlign: string): typeof AlignmentType => {
      switch (textAlign) {
        case "right":
          return AlignmentType.RIGHT;
        case "center":
          return AlignmentType.CENTER;
        case "justify":
          return AlignmentType.JUSTIFIED;
        case "start":
          return AlignmentType.START;
        case "end":
          return AlignmentType.END;
        case "both":
          return AlignmentType.BOTH;
        case "mediumKashida":
          return AlignmentType.MEDIUM_KASHIDA;
        case "distribute":
          return AlignmentType.DISTRIBUTE;
        case "numTab":
          return AlignmentType.NUM_TAB;
        case "highKashida":
          return AlignmentType.HIGH_KASHIDA;
        case "lowKashida":
          return AlignmentType.LOW_KASHIDA;
        case "thaiDistribute":
          return AlignmentType.THAI_DISTRIBUTE;
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

export const printEditor = (editor: Editor) => {
  const content = editor.getHTML();

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the document");
    return;
  }

  // Add content and styles to the new window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 20mm;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            /* Editor content styles */
            .content {
              max-width: 100%;
            }
            
            /* Typography */
            h1, h2, h3, h4, h5, h6 {
              margin: 1em 0 0.5em;
              line-height: 1.2;
              break-after: avoid;
            }
            
            p {
              margin: 0.5em 0;
              line-height: 1.5;
            }
            
            /* Code blocks */
            pre {
              background: #f5f5f5;
              padding: 1em;
              border-radius: 4px;
              overflow-x: auto;
              white-space: pre-wrap;
              page-break-inside: avoid;
            }
            
            /* Lists */
            ul, ol {
              padding-left: 2em;
              margin: 0.5em 0;
            }
            
            /* Images */
            img {
              max-width: 100%;
              height: auto;
              page-break-inside: avoid;
            }
            
            /* Links */
            a {
              color: #2563eb;
              text-decoration: underline;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1em 0;
              page-break-inside: avoid;
            }
            
            /* Highlighted text */
            mark[data-color="yellow"] { background-color: #fef9c3; }
            mark[data-color="green"] { background-color: #dcfce7; }
            mark[data-color="blue"] { background-color: #dbeafe; }
            mark[data-color="red"] { background-color: #fee2e2; }
          }
        </style>
      </head>
      <body>
        <div class="content">${content}</div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};