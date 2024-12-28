import React from 'react';
import { Editor } from '@tiptap/react';
import Button from '../Button';

interface TextControlsProps {
  editor: Editor;
}

const headingLevels = [1, 2, 3, 4, 5, 6];

const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          level === 0
            ? editor.chain().focus().setParagraph().run()
            : editor.chain().focus().toggleHeading({ level }).run();
        }}
        value={
          headingLevels.find((level) =>
            editor.isActive("heading", { level })
          ) || 0
        }
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white min-w-[120px]"
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
        <option value={5}>Heading 5</option>
        <option value={6}>Heading 6</option>
      </select>

      {/* <select
        onChange={(e) => {
          const style = editor.getAttributes('textStyle');
          editor.chain().focus().setStyle({ ...style, fontSize: e.target.value + 'px' }).run();
        }}
        defaultValue="16"
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white w-24"
      >
        {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select> */}
      <select
        onChange={(e) => {
          editor.chain().focus().setFontSize(e.target.value).run();
        }}
        value={editor.getAttributes("textStyle").fontSize || "16"}
        className="h-8 border rounded-md px-2 py-1 text-sm bg-white w-24"
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