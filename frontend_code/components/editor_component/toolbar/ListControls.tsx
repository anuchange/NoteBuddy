import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import Button from '../Button';

interface ListControlsProps {
  editor: Editor;
}

const ListControls: React.FC<ListControlsProps> = ({ editor, theme }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        size="sm"
        title="Bullet List"
        className={
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }
      >
        <List size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        size="sm"
        title="Numbered List"
        className={
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }
      >
        <ListOrdered size={18} />
      </Button>
    </div>
  );
};


export default ListControls;