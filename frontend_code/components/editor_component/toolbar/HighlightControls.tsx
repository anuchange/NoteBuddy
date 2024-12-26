import React from 'react';
import { Editor } from '@tiptap/react';
import { Highlighter } from 'lucide-react';
import Button from '../Button';

interface HighlightControlsProps {
  editor: Editor;
}

const highlights = [
  { color: 'yellow', class: 'bg-yellow-200' },
  { color: 'green', class: 'bg-green-200' },
  { color: 'blue', class: 'bg-blue-200' },
  { color: 'red', class: 'bg-red-200' },
];

const HighlightControls: React.FC<HighlightControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      {highlights.map((highlight) => (
        <Button
          key={highlight.color}
          onClick={() => editor.chain().focus().toggleHighlight({ color: highlight.color }).run()}
          active={editor.isActive('highlight', { color: highlight.color })}
          size="sm"
          title={`${highlight.color} Highlight`}
          className={highlight.class}
        >
          <Highlighter size={18} />
        </Button>
      ))}
    </div>
  );
};

export default HighlightControls;