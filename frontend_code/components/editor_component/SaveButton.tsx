import React from "react";
import { Download } from "lucide-react";
import Button from "./Button";
import { Editor } from "@tiptap/react";
import { exportToPdf, exportToDocx, printEditor } from "../lib/export";

interface SaveButtonProps {
  editor: Editor;
}

const SaveButton: React.FC<SaveButtonProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => printEditor(editor)}
        size="sm"
        className="bg-blue-500 text-white hover:bg-blue-600"
        title="Save as PDF"
      >
        <Download size={18} className="mr-2" />
        Print
      </Button>
      <Button
        onClick={() => exportToPdf(editor)}
        size="sm"
        className="bg-blue-500 text-white hover:bg-blue-600"
        title="Save as PDF"
      >
        <Download size={18} className="mr-2" />
        PDF
      </Button>
      <Button
        onClick={() => exportToDocx(editor)}
        size="sm"
        className="bg-blue-500 text-white hover:bg-blue-600"
        title="Save as DOCX"
      >
        <Download size={18} className="mr-2" />
        DOCX
      </Button>
    </div>
  );
};

export default SaveButton;
