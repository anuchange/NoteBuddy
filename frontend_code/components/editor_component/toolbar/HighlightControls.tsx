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

const HighlightControls: React.FC<HighlightControlsProps> = ({
  editor,
  theme,
}) => {
  const highlights = [
    {
      color: "yellow",
      class: theme === "dark" ? "bg-yellow-600" : "bg-yellow-200",
    },
    {
      color: "green",
      class: theme === "dark" ? "bg-green-600" : "bg-green-200",
    },
    { color: "blue", class: theme === "dark" ? "bg-blue-600" : "bg-blue-200" },
    { color: "red", class: theme === "dark" ? "bg-red-600" : "bg-red-200" },
  ];

  return (
    <div className="flex items-center gap-1">
      {highlights.map((highlight) => (
        <Button
          key={highlight.color}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: highlight.color })
              .run()
          }
          active={editor.isActive("highlight", { color: highlight.color })}
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