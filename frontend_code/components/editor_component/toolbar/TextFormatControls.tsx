import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic } from 'lucide-react';
import Button from '../Button';

interface TextFormatControlsProps {
  editor: Editor;
}

const TextFormatControls: React.FC<TextFormatControlsProps> = ({
  editor,
  theme,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        size="sm"
        title="Bold"
        className={
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }
      >
        <Bold size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        size="sm"
        title="Italic"
        className={
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }
      >
        <Italic size={18} />
      </Button>
    </div>
  );
};


export default TextFormatControls;