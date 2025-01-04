import React from 'react';
import { Editor } from '@tiptap/react';
import { Code } from 'lucide-react';
import Button from '../Button';
import { languages } from '../../lib/languages';

interface CodeControlsProps {
  editor: Editor;
  theme?: 'dark' | 'light';  // Add theme to props interface
}

const CodeControls: React.FC<CodeControlsProps> = ({ editor, theme }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => editor.chain().focus().setCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        size="sm"
        title="Add Code Block"
        className={
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }
      >
        <Code size={18} />
      </Button>
      <select
        onChange={(e) => {
          editor
            .chain()
            .focus()
            .setCodeBlock({ language: e.target.value })
            .run();
        }}
        className={`h-8 border rounded-md px-2 py-1 text-sm ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`}
        disabled={!editor.isActive("codeBlock")}
      >
        {Object.entries(languages).map(([key, { name }]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CodeControls;