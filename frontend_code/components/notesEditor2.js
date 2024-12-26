import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bold, Italic, Code, List, Save, X, Pencil } from "lucide-react";

const RichNotesEditor = () => {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const editorRef = useRef(null);

  const supportedLanguages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/your-fastapi-endpoint");
        const htmlContent = await response.text();
        setNotes(htmlContent);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleSave = async () => {
    try {
      const content = editorRef.current.innerHTML;
      await fetch("/your-save-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
        },
        body: content,
      });
      setNotes(content);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const executeCommand = (command) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, null);
    }
  };

  const insertCodeBlock = () => {
    if (codeInput.trim()) {
      // Format the code
      const formattedCode = codeInput
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .split("\n")
        .join("<br>");

      // Create the code block HTML
      const codeBlock = `
        <pre class="language-${selectedLanguage} bg-gray-100 p-4 rounded-md my-2 overflow-x-auto">
          <code class="language-${selectedLanguage}">${formattedCode}</code>
        </pre><p></p>
      `;

      // Insert the code block
      document.execCommand("insertHTML", false, codeBlock);

      // Reset state
      setCodeInput("");
      setShowCodeInput(false);

      // Apply syntax highlighting
      if (window.Prism) {
        window.Prism.highlightAll();
      }

      // Focus back on the editor
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  //   const CodeInputDialog = () => (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //       <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
  //         <div className="mb-4">
  //           <h3 className="text-lg font-semibold mb-2">Insert Code</h3>
  //           <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
  //             <SelectTrigger className="w-full mb-2">
  //               <SelectValue placeholder="Select Language" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {supportedLanguages.map((lang) => (
  //                 <SelectItem key={lang.value} value={lang.value}>
  //                   {lang.label}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>
  //           <textarea
  //             value={codeInput}
  //             onChange={(e) => setCodeInput(e.target.value)}
  //             className="w-full h-48 p-2 border rounded font-mono text-sm"
  //             placeholder="Paste your code here..."
  //             spellCheck="false"
  //           />
  //         </div>
  //         <div className="flex justify-end gap-2">
  //           <button
  //             variant="outline"
  //             onClick={() => {
  //               setShowCodeInput(false);
  //               setCodeInput("");
  //             }}
  //           >
  //             Cancel
  //           </button>
  //           <button onClick={insertCodeBlock}>Insert Code</button>
  //         </div>
  //       </div>
  //     </div>
  //   );

  const EditorToolbar = () => (
    <div className="flex items-center border-b bg-gray-50 p-1">
      <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("bold")}
          className="h-8 w-8 p-1"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("italic")}
          className="h-8 w-8 p-1"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          variant="ghost"
          size="sm"
          onClick={() => setShowCodeInput(true)}
          className="h-8 flex items-center gap-1 px-2"
          title="Insert Code"
        >
          <Code className="h-4 w-4" />
          <span className="text-sm">Code</span>
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-l pl-2 ml-2">
        <button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
          className="h-8 w-8 p-1"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
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
                  if (editorRef.current) {
                    editorRef.current.innerHTML = notes;
                  }
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
          <>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dangerouslySetInnerHTML={{ __html: notes }}
              onFocus={() => {
                // Ensure cursor is in the editor
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              }}
            />
            {/* {showCodeInput && <CodeInputDialog />} */}
          </>
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
