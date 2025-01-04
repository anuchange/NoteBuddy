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
  theme?: 'dark' | 'light';  // Add theme to props interface
}

const lineHeights = ['1', '1.2', '1.5', '2', '2.5', '3'];
const spacingValues = ['0', '2', '4', '8', '12', '16'];

const LayoutControls: React.FC<LayoutControlsProps> = ({ editor, theme }) => {
  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            title="Line Height"
            className={
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-50 text-gray-900"
            }
          >
            <ArrowUpDown size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`w-48 p-2 rounded-lg shadow-lg border ${
            theme === "dark"
              ? "bg-gray-900 text-gray-100 border-gray-700"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <div className="grid grid-cols-3 gap-1">
            {lineHeights.map((height) => (
              <Button
                key={height}
                size="sm"
                onClick={() => {
                  editor.chain().focus().setLineHeight(height).run();
                }}
                className={
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }
              >
                {height}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};


export default LayoutControls;