import { AlignmentType, HeadingLevel } from "docx";

interface ParsedContent {
  text: string;
  fontSize: number;
  headingLevel?: typeof HeadingLevel;
  alignment: typeof AlignmentType;
  isCode: boolean;
  isBold: boolean;
  isItalic: boolean;
}

// Define our custom alignment type
type AlignmentType = "center" | "end" | "left" | "right" | "start" | "both" | "mediumKashida" | "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute";

const getTextAlignment = (element: Element): AlignmentType => {  // Return our custom type
  const style = window.getComputedStyle(element);
  const textAlign = style.textAlign;
  switch (textAlign) {
    case "right":
      return "right";
    case "center":
      return "center";
    case "justify":
      return "both";  // "justify" maps to "both"
    default:
      return "left";
  }
};

// Define the heading level type based on the error message
type HeadingLevel = "Heading1" | "Heading2" | "Heading3" | "Heading4" | "Heading5" | "Heading6" | "Title";

const getHeadingLevel = (element: Element): HeadingLevel | undefined => {
  const tagName = element.tagName.toLowerCase();
  switch (tagName) {
    case "h1":
      return "Heading1";
    case "h2":
      return "Heading2";
    case "h3":
      return "Heading3";
    case "h4":
      return "Heading4";
    case "h5":
      return "Heading5";
    case "h6":
      return "Heading6";
    default:
      return undefined;
  }
};


export const parseEditorContent = (content: string): ParsedContent[] => {
  const container = document.createElement("div");
  container.innerHTML = content;

  return Array.from(container.children).map((element) => {
    const text = element.textContent || "";
    const headingLevel = getHeadingLevel(element);
    const isCode = element.tagName.toLowerCase() === "pre";

    return {
      text,
      fontSize: headingLevel ? 16 : 12,
      headingLevel,
      alignment: getTextAlignment(element),
      isCode,
      isBold: element.querySelector("strong") !== null,
      isItalic: element.querySelector("em") !== null,
    };
  });
};
