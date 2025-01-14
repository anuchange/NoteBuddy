import { useEditor, EditorContent } from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import { useEditorExtensions } from "../hooks/useEditorExtensions";
import MenuBar from "./MenuBar";
import SaveButton from "./SaveButton";
import { useEffect, useState, useRef } from "react";
import { Image as LucideImage } from "lucide-react";

const lowlight = createLowlight(common);

const Editor = ({ notesData, theme, videoId }) => {
  const [editorHeight, setEditorHeight] = useState("auto");
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const editorContainerRef = useRef(null);
  const editorHeaderRef = useRef(null);
  const menuBarRef = useRef(null);
  const fileInputRef = useRef(null);
  const extensions = useEditorExtensions();

  const editor = useEditor({
    extensions,
    content: notesData,
    editorProps: {
      attributes: {
        class: [
          "prose prose-sm max-w-none mx-auto focus:outline-none",
          theme === "dark"
            ? "prose-headings:text-gray-100 prose-p:text-gray-200 prose-pre:bg-gray-800 prose-code:bg-gray-700 prose-strong:text-gray-200"
            : "prose-headings:text-gray-700 prose-p:text-gray-900 prose-pre:bg-gray-100 prose-code:bg-gray-200",
        ].join(" "),
      },
    },
  });

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);

        // Insert image into editor
        if (editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  useEffect(() => {
    if (editor && notesData) {
      if (editor.getHTML() !== notesData) {
        editor.commands.setContent(notesData);
      }
    }
  }, [editor, notesData]);

  useEffect(() => {
    const adjustEditorHeight = () => {
      const editorContainer = editorContainerRef.current;
      const editorHeader = editorHeaderRef.current;
      const menuBar = menuBarRef.current;
      if (editorContainer && editorHeader && menuBar) {
        const containerHeight = editorContainer.offsetHeight;
        const headerHeight = editorHeader.offsetHeight;
        const menuBarHeight = menuBar.offsetHeight;
        setEditorHeight(`${containerHeight - headerHeight - menuBarHeight}px`);
      }
    };

    window.addEventListener("resize", adjustEditorHeight);
    adjustEditorHeight();

    return () => {
      window.removeEventListener("resize", adjustEditorHeight);
    };
  }, [
    editorContainerRef.current,
    editorHeaderRef.current,
    menuBarRef.current,
    videoId,
  ]);

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={editorContainerRef}
      className={`rounded-lg shadow-lg overflow-hidden z-10 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300"
      }`}
    >
      <div
        ref={editorHeaderRef}
        className={`flex justify-between items-center px-4 py-2 ${
          theme === "dark"
            ? "bg-gray-800 border-b border-gray-700"
            : "bg-gray-50 border-b border-gray-300"
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-700"
          }`}
        >
          Editor
        </h2>
        {/* <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-200"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <LucideImage className="h-5 w-5" />
          </button> */}
        <SaveButton editor={editor} />
        {/* </div> */}
      </div>

      <div ref={menuBarRef}>
        <MenuBar editor={editor} theme={theme} />
      </div>

      <div
        ref={editorContainerRef}
        className={`relative p-6 overflow-y-scroll [&>div]:h-full [&>div>div]:h-full [&>div]:overflow-scroll [&>div>div]:overflow-scroll ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100 [&>div>div]:bg-gray-700 [&>div>div]:text-gray-200"
            : "bg-white text-gray-900"
        } ${isDragging ? "border-2 border-dashed border-blue-500" : ""}`}
        style={{ height: editorHeight }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <EditorContent editor={editor} />

        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center pointer-events-none">
            <div
              className={`text-lg font-medium ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Drop image here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
