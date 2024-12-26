import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "components/ui/card";
// import { button } from "components/ui/button";
// import { Input } from "components/ui/input";
import {
  Bold,
  Italic,
  Code,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Image,
  Heading1,
  Heading2,
  Link2,
  Save,
  X,
  Pencil,
} from "lucide-react";

const RichNotesEditor = () => {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/your-fastapi-endpoint");
        const htmlContent = await response.text();
        setNotes(htmlContent);
        setEditableContent(htmlContent);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleSave = async () => {
    try {
      await fetch("/your-save-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
        },
        body: editableContent,
      });
      setNotes(editableContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById("richTextEditor");
    editor.focus();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = `<img src="${event.target.result}" alt="Uploaded image" class="max-w-full h-auto my-2" />`;
        executeCommand("insertHTML", img);
      };
      reader.readAsDataURL(file);
    }
  };

  const EditorToolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      {/* Text Style */}
      <div className="flex gap-1 border-r pr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("formatBlock", "<h1>")}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r pr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyLeft")}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyCenter")}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyRight")}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r pr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Code */}
      <div className="flex gap-1 border-r pr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("formatBlock", "<pre>")}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Image Upload */}
      <div className="flex gap-1">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
        />
        <button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById("imageUpload").click()}
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="w-full max-w-4xl mx-auto mt-8"
      // style={{ boxSizing: 'border-box',
      // borderWidth: '0',
      // border-style: solid,
      // border-color: #e5e7eb,
      // background: #fff,
      // border-radius: 10px,
      // /* box-shadow: 2px 2px, */
      // --tw-shadow: 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a,
      // --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color),
      // box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow), }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                variant="default"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableContent(notes);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && <EditorToolbar />}

      <div className="p-6">
        {isEditing ? (
          <div
            id="richTextEditor"
            contentEditable
            className="min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dangerouslySetInnerHTML={{ __html: editableContent }}
            onInput={(e) => setEditableContent(e.currentTarget.innerHTML)}
          />
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: notes }}
          />
        )}
      </div>
    </div>
  );
};

export default RichNotesEditor;
