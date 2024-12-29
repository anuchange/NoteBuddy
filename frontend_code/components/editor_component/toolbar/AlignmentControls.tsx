import React from "react";
import { Editor } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import Button from "../Button";

interface AlignmentControlsProps {
  editor: Editor;
  theme: "light" | "dark";
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  editor,
  theme,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        size="sm"
        title="Align Left"
        className={`${
          editor.isActive({ textAlign: "left" })
            ? theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-black"
            : theme === "dark"
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        <AlignLeft size={18} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        size="sm"
        title="Align Center"
        className={`${
          editor.isActive({ textAlign: "center" })
            ? theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-black"
            : theme === "dark"
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        <AlignCenter size={18} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        size="sm"
        title="Align Right"
        className={`${
          editor.isActive({ textAlign: "right" })
            ? theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-black"
            : theme === "dark"
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        <AlignRight size={18} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        size="sm"
        title="Align Justify"
        className={`${
          editor.isActive({ textAlign: "justify" })
            ? theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-black"
            : theme === "dark"
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        <AlignJustify size={18} />
      </Button>
    </div>
  );
};

export default AlignmentControls;
