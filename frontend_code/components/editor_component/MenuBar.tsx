import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Button from "./Button";
import TextControls from "./toolbar/TextControls";
import AlignmentControls from "./toolbar/AlignmentControls";
import ListControls from "./toolbar/ListControls";
import FontControls from "./toolbar/FontControls";
import HighlightControls from "./toolbar/HighlightControls";
import LayoutControls from "./toolbar/LayoutControls";
import CodeControls from "./toolbar/CodeControls";
import TextFormatControls from "./toolbar/TextFormatControls";

interface MenuBarProps {
  editor: Editor;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  return (
    <div className="border-b p-2 flex flex-wrap gap-2 items-center bg-gray-50">
      <div className="border-b bg-gray-50 w-full">
        <div className="p-2 overflow-hidden">
          <div className="flex flex-col gap-2 sm:gap-3 bg-white rounded-md shadow-sm">
            {/* Top Row */}
            <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <TextControls editor={editor} />
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <FontControls editor={editor} />
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <TextFormatControls editor={editor} />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <HighlightControls editor={editor} />
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <AlignmentControls editor={editor} />
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <ListControls editor={editor} />
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <LayoutControls editor={editor} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full p-2 bg-white rounded-md shadow-sm w-full">
        <div className="relative">
          <Button
            onClick={() => setShowLinkInput(!showLinkInput)}
            active={editor.isActive("link")}
            size="sm"
            title="Add Link"
          >
            <LinkIcon size={18} />
          </Button>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 w-64 border border-gray-200">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full border rounded-md px-2 py-1 text-sm mb-2"
              />
              <Button
                onClick={() => {
                  editor.chain().focus().setLink({ href: linkUrl }).run();
                  setLinkUrl("");
                  setShowLinkInput(false);
                }}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Link
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            onClick={() => setShowImageInput(!showImageInput)}
            size="sm"
            title="Add Image"
          >
            <ImageIcon size={18} />
          </Button>
          {showImageInput && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 w-64 border border-gray-200">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full border rounded-md px-2 py-1 text-sm mb-2"
              />
              <Button
                onClick={() => {
                  editor.chain().focus().setImage({ src: imageUrl }).run();
                  setImageUrl("");
                  setShowImageInput(false);
                }}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Image
              </Button>
            </div>
          )}
        </div>

        <CodeControls editor={editor} />
      </div>
    </div>
  );
};

export default MenuBar;
