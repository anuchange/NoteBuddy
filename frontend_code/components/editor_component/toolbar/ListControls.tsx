import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import Button from '../Button';

interface ListControlsProps {
  editor: Editor;
}

const ListControls: React.FC<ListControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        size="sm"
        title="Bullet List"
      >
        <List size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        size="sm"
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </Button>
    </div>
  );
};

export default ListControls;