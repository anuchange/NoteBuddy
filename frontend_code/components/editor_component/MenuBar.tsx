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
  theme?: 'dark' | 'light';  // Add theme to props interface
}

const MenuBar = ({ editor, theme }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  return (
    <div
      className={`p-2 flex flex-wrap gap-2 items-center border-b ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-300"
      }`}
    >
      <div className={`w-full`}>
        <div
          className={`p-2 overflow-hidden ${
            theme === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-white text-gray-900"
          }`}
        >
          <div className="flex flex-col gap-2 sm:gap-3 rounded-md shadow-sm">
            {/* Top Row */}
            <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <TextControls editor={editor} theme={theme} />
              <div
                className={`w-px h-6 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                } shrink-0`}
              />
              <FontControls editor={editor} theme={theme} />
              <div
                className={`w-px h-6 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                } shrink-0`}
              />
              <TextFormatControls editor={editor} theme={theme} />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <HighlightControls editor={editor} theme={theme} />
              <div
                className={`w-px h-6 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                } shrink-0`}
              />
              <AlignmentControls editor={editor} theme={theme} />
              <div
                className={`w-px h-6 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                } shrink-0`}
              />
              <ListControls editor={editor} theme={theme} />
              <div
                className={`w-px h-6 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                } shrink-0`}
              />
              <LayoutControls editor={editor} theme={theme} />
            </div>
          </div>
        </div>
      </div>
      {/* Link Input */}
      <div className="flex items-center gap-2 w-full p-2 rounded-md shadow-sm">
        <div className="relative">
          {/* Add Link Button */}
          <Button
            onClick={() => setShowLinkInput(!showLinkInput)}
            active={editor.isActive("link")}
            size="sm"
            title="Add Link"
            className={
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-100 text-gray-900"
            }
          >
            {theme === "dark" ? (
              <LinkIcon size={18} className="text-gray-100" /> // Dark theme icon
            ) : (
              <LinkIcon size={18} className="text-gray-900" /> // Light theme icon
            )}
          </Button>

          {/* Link Input */}
          {showLinkInput && (
            <div
              className={`absolute top-full left-0 mt-1 p-2 z-10 w-64 border rounded-lg shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className={`w-full border rounded-md px-2 py-1 text-sm ${
                  theme === "dark"
                    ? "bg-gray-900 text-gray-100 border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
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

        {/* Image Input */}
        <div className="relative">
          {/* Add Image Button */}
          <Button
            onClick={() => setShowImageInput(!showImageInput)}
            size="sm"
            title="Add Image"
            className={
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-100 text-gray-900"
            }
          >
            {theme === "dark" ? (
              <ImageIcon size={18} className="text-gray-100" /> // Dark theme icon
            ) : (
              <ImageIcon size={18} className="text-gray-900" /> // Light theme icon
            )}
          </Button>

          {/* Image Input */}
          {showImageInput && (
            <div
              className={`absolute top-full left-0 mt-1 p-2 z-10 w-64 border rounded-lg shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className={`w-full border rounded-md px-2 py-1 text-sm ${
                  theme === "dark"
                    ? "bg-gray-900 text-gray-100 border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
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

        <CodeControls editor={editor} theme={theme} />
      </div>
    </div>
  );
};


export default MenuBar;
