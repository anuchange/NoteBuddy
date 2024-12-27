import React from 'react';
import { Editor } from '@tiptap/react';
import { Code } from 'lucide-react';
import Button from '../Button';
import { languages } from '../../lib/languages';

interface CodeControlsProps {
  editor: Editor;
}

const CodeControls: React.FC<CodeControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => editor.chain().focus().setCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        size="sm"
        title="Add Code Block"
      >
        <Code size={18} />
      </Button>
      <select
        onChange={(e) => {
          editor.chain().focus().setCodeBlock({ language: e.target.value }).run();
        }}
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white hover:bg-gray-50"
        disabled={!editor.isActive('codeBlock')}
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