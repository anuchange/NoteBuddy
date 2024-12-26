import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
} from "lucide-react";
import Button from "./Button";
import AlignmentControls from "./toolbar/AlignmentControls";
import ListControls from "./toolbar/ListControls";
import FontControls from "./toolbar/FontControls";
import HighlightControls from "./toolbar/HighlightControls";
import LayoutControls from "./toolbar/LayoutControls";
import { languages } from "../../lib/languages";

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
      <div className="flex items-center gap-4 w-full p-2 bg-white rounded-md shadow-sm">
        <FontControls editor={editor} />

        <div className="w-px h-6 bg-gray-300" />

        <div className="flex items-center gap-1">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            size="sm"
            title="Bold"
            className="hover:bg-gray-100"
          >
            <Bold size={18} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            size="sm"
            title="Italic"
            className="hover:bg-gray-100"
          >
            <Italic size={18} />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300" />
        <HighlightControls editor={editor} />

        <div className="w-px h-6 bg-gray-300" />
        <AlignmentControls editor={editor} />

        <div className="w-px h-6 bg-gray-300" />
        <ListControls editor={editor} />

        <div className="w-px h-6 bg-gray-300" />
        <LayoutControls editor={editor} />
      </div>

      <div className="flex items-center gap-2 w-full p-2 bg-white rounded-md shadow-sm">
        <div className="relative">
          <Button
            onClick={() => setShowLinkInput(!showLinkInput)}
            active={editor.isActive("link")}
            size="sm"
            title="Add Link"
            className="hover:bg-gray-100"
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
            className="hover:bg-gray-100"
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

        <div className="flex items-center gap-2">
          <Button
            onClick={() => editor.chain().focus().setCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            size="sm"
            title="Add Code Block"
            className="hover:bg-gray-100"
          >
            <Code size={18} />
          </Button>
          <select
            onChange={(e) => {
              editor
                .chain()
                .focus()
                .setCodeBlock({ language: e.target.value })
                .run();
            }}
            className="h-8 border rounded-md px-2 py-1 text-sm bg-white hover:bg-gray-50"
          >
            {Object.entries(languages).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
