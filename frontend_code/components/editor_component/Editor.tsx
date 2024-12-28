import { useEditor, EditorContent } from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import { useEditorExtensions } from "../hooks/useEditorExtensions";
import MenuBar from "./MenuBar";
import SaveButton from "./SaveButton";
import { useEffect } from "react";

const lowlight = createLowlight(common);

const Editor = ({ notesData }) => {
  const extensions = useEditorExtensions(lowlight);

  const editor = useEditor({
    extensions,
    content: notesData,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none mx-auto focus:outline-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-sm prose-pre:text-sm prose-code:text-sm prose-p:text-justify prose-headings:text-left",
      },
    },
  });
  useEffect(() => {
    if (editor && notesData) {
      // Only update if the content is different
      if (editor.getHTML() !== notesData) {
        editor.commands.setContent(notesData);
      }
    }
  }, [editor, notesData]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-700">Editor</h2>
        <SaveButton editor={editor} />
      </div>
      <MenuBar editor={editor} />
      <div className="p-6 h-96 overflow-y-scroll">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
