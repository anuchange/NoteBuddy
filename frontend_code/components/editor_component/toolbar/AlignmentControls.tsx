import React from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Button from '../Button';

interface AlignmentControlsProps {
  editor: Editor;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        size="sm"
        title="Align Left"
      >
        <AlignLeft size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        size="sm"
        title="Align Center"
      >
        <AlignCenter size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        size="sm"
        title="Align Right"
      >
        <AlignRight size={18} />
      </Button>
    </div>
  );
};

export default AlignmentControls;