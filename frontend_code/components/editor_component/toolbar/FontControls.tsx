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

const FontControls: React.FC<FontControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => {
          editor.chain().focus().setFontFamily(e.target.value).run();
        }}
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white min-w-[100px]"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="8"
        max="28"
        defaultValue="16"
        onChange={(e) => {
          editor.chain().focus().setFontSize(e.target.value + 'px').run();
        }}
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white w-20"
      />
    </div>
  );
};

export default FontControls;