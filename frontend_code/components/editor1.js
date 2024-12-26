"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS

const Editor = React.forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const { defaultValue, onTextChangeRef, onSelectionChangeRef } = props;
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    const editorContainer = containerRef.current;
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    // Clear the default content
    quill.setContents([]);
    console.log("default=", defaultValueRef.current);
    if (defaultValueRef?.current) {
      quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current);
    }

    quill.on("text-change", (...args) => {
      onTextChangeRef?.current?.(...args);
    });

    quill.on("selection-change", (...args) => {
      onSelectionChangeRef?.current?.(...args);
    });

    return () => {
      ref.current = null;
      editorContainer.innerHTML = "";
    };
  }, [ref, defaultValueRef, onTextChangeRef, onSelectionChangeRef]);

  return <div ref={containerRef} style={{ height: "400px" }}></div>; // Ensure the container has a height
});

Editor.displayName = "Editor";

export default Editor;
