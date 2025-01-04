import { useEditor, EditorContent } from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import { useEditorExtensions } from "../hooks/useEditorExtensions";
import MenuBar from "./MenuBar";
import SaveButton from "./SaveButton";
import { useEffect, useState, useRef } from "react";

const lowlight = createLowlight(common);

const Editor = ({ notesData, theme, videoId }) => {
  const [editorHeight, setEditorHeight] = useState("auto");
  const editorContainerRef = useRef(null);
  const editorHeaderRef = useRef(null);
  const menuBarRef = useRef(null);
  const extensions = useEditorExtensions(lowlight);

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

  useEffect(() => {
    if (editor && notesData) {
      // Update content only if different
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
      console.log("editor", editorContainer, editorHeader, menuBar);
      if (editorContainer && editorHeader && menuBar) {
        const containerHeight = editorContainer.offsetHeight;
        const headerHeight = editorHeader.offsetHeight;
        const menuBarHeight = menuBar.offsetHeight;
        setEditorHeight(containerHeight - headerHeight - menuBarHeight);
      }
    };

    // Adjust on component mount and window resize
    window.addEventListener("resize", adjustEditorHeight);
    adjustEditorHeight(); // Initial adjustment

    // Clean up on component unmount
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
        <SaveButton editor={editor} />
      </div>
      <div ref={menuBarRef}>
        <MenuBar editor={editor} theme={theme} />
      </div>

      <div
        ref={editorContainerRef}
        className={`p-6 overflow-y-scroll [&>div]:h-full [&>div>div]:h-full [&>div]:overflow-scroll [&>div>div]:overflow-scroll ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100 [&>div>div]:bg-gray-700 [&>div>div]:text-gray-200"
            : "bg-white text-gray-900"
        }`}
        style={{ height: editorHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
