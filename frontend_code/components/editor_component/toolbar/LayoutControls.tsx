import React from 'react';
import { Editor } from '@tiptap/react';
import { ArrowUpDown, MoveHorizontal } from 'lucide-react';
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
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" title="Line Height">
            <ArrowUpDown size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-1">
            {lineHeights.map((height) => (
              <Button
                key={height}
                size="sm"
                onClick={() => {
                  const style = editor.getAttributes("textStyle");
                  editor.chain().focus().setLineHeight(height).run();
                }}
                className="hover:bg-gray-100"
              >
                {height}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" title="Paragraph Spacing">
            <MoveHorizontal size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-1">
            {spacingValues.map((spacing) => (
              <Button
                key={spacing}
                size="sm"
                onClick={() => {
                  const style = editor.getAttributes('textStyle');
                  editor.chain().focus().setStyle({ ...style, marginBottom: `${spacing}px` }).run();
                }}
                className="hover:bg-gray-100"
              >
                {spacing}px
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};

export default LayoutControls;