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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  // Add useEffect to update editor content when notesData changes
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
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
