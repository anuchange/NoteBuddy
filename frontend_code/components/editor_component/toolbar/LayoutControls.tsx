import React from 'react';
import { Editor } from '@tiptap/react';
import { IndentIcon, OutdentIcon, ArrowUpDown, MoveHorizontal } from 'lucide-react';
import Button from '../Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface LayoutControlsProps {
  editor: Editor;
}

const lineHeights = ['1', '1.2', '1.5', '2', '2.5', '3'];
const spacingValues = ['0', '2', '4', '8', '12', '16'];

const LayoutControls: React.FC<LayoutControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => editor.chain().focus().indent().run()}
        size="sm"
        className="hover:bg-gray-100"
        title="Indent"
      >
        <IndentIcon size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().outdent().run()}
        size="sm"
        className="hover:bg-gray-100"
        title="Outdent"
      >
        <OutdentIcon size={18} />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" className="hover:bg-gray-100" title="Line Height">
            <ArrowUpDown size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-1">
            {lineHeights.map((height) => (
              <Button
                key={height}
                size="sm"
                onClick={() => editor.chain().focus().setLineHeight(height).run()}
                className={`hover:bg-gray-100 ${
                  editor.isActive({ lineHeight: height }) ? 'bg-gray-200' : ''
                }`}
              >
                {height}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" className="hover:bg-gray-100" title="Paragraph Spacing">
            <MoveHorizontal size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-1">
            {spacingValues.map((spacing) => (
              <Button
                key={spacing}
                size="sm"
                onClick={() => 
                  editor.chain().focus().setParagraphSpacing(parseInt(spacing)).run()
                }
                className={`hover:bg-gray-100 ${
                  editor.isActive({ paragraphSpacing: spacing }) ? 'bg-gray-200' : ''
                }`}
              >
                {spacing}px
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LayoutControls;