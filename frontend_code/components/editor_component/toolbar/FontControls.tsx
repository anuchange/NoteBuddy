import React from 'react';
import { Editor } from '@tiptap/react';
import Button from '../Button';

interface FontControlsProps {
  editor: Editor;
}

const fonts = [
  { name: 'Default', value: 'inter' },
  { name: 'Calibri', value: 'calibri' },
  { name: 'Arial', value: 'arial' },
  { name: 'Times New Roman', value: 'times' },
  { name: 'Courier New', value: 'courier' },
];

const fontSizes = Array.from({ length: 20 }, (_, i) => i + 8); // 8px to 28px

const FontControls: React.FC<FontControlsProps> = ({ editor, theme }) => {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => {
          editor.chain().focus().setFontFamily(e.target.value).run();
        }}
        className={`h-8 border rounded-md px-2 py-1 text-sm ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`}
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};


export default FontControls;