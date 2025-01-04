import React from "react";
import { Editor } from "@tiptap/react";
import Button from "../Button";

interface TextControlsProps {
  editor: Editor;
  theme: "light" | "dark";
}

// Define valid heading levels type
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

const TextControls: React.FC<TextControlsProps> = ({ editor, theme }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Heading Level Selector */}
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            // Cast level to HeadingLevel since we know it's valid
            editor.chain().focus().toggleHeading({ level: level as HeadingLevel }).run();
          }
        }}
        value={
          headingLevels.find((level) =>
            editor.isActive("heading", { level })
          ) || 0
        }
        className={`h-8 border rounded-md px-2 py-1 text-sm min-w-[120px] ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`}
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
        <option value={5}>Heading 5</option>
        <option value={6}>Heading 6</option>
      </select>

      {/* Font Size Selector */}
      <select
        onChange={(e) => {
          editor.chain().focus().setFontSize(e.target.value).run();
        }}
        value={editor.getAttributes("textStyle").fontSize || "16"}
        className={`h-8 border rounded-md px-2 py-1 text-sm w-24 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`}
      >
        {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
};

export default TextControls;