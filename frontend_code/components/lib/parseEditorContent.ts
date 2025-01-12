import { AlignmentType, HeadingLevel } from "docx";

interface ParsedContent {
  text: string;
  fontSize: number;
  headingLevel?: HeadingLevelType;
  alignment: Alignment;
  isCode: boolean;
  isBold: boolean;
  isItalic: boolean;
}
type Alignment = 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';

const getTextAlignment = (element: Element): Alignment => {
  const style = window.getComputedStyle(element);
  const textAlign = style.textAlign;
  switch (textAlign) {
    case "right":
      return 'RIGHT';
    case "center":
      return 'CENTER';
    case "justify":
      return 'JUSTIFIED';
    default:
      return 'LEFT';
  }
};

type HeadingLevelType = 'HEADING_1' | 'HEADING_2' | 'HEADING_3' | 'HEADING_4' | 'HEADING_5' | 'HEADING_6';

const getHeadingLevel = (element: Element): HeadingLevelType | undefined => {
  const tagName = element.tagName.toLowerCase();
  switch (tagName) {
    case "h1":
      return 'HEADING_1';
    case "h2":
      return 'HEADING_2';
    case "h3":
      return 'HEADING_3';
    case "h4":
      return 'HEADING_4';
    case "h5":
      return 'HEADING_5';
    case "h6":
      return 'HEADING_6';
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