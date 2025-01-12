import { AlignmentType, HeadingLevel } from "docx";

interface ParsedContent {
  text: string;
  fontSize: number;
  headingLevel?: HeadingLevel;
  alignment: AlignmentType;
  isCode: boolean;
  isBold: boolean;
  isItalic: boolean;
}

const getTextAlignment = (element: Element): AlignmentType => {
  const style = window.getComputedStyle(element);
  const textAlign = style.textAlign;
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

const getHeadingLevel = (element: Element): HeadingLevel | undefined => {
  const tagName = element.tagName.toLowerCase();
  switch (tagName) {
    case "h1":
      return HeadingLevel.HEADING_1;
    case "h2":
      return HeadingLevel.HEADING_2;
    case "h3":
      return HeadingLevel.HEADING_3;
    case "h4":
      return HeadingLevel.HEADING_4;
    case "h5":
      return HeadingLevel.HEADING_5;
    case "h6":
      return HeadingLevel.HEADING_6;
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