// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// // Dynamically import Quill-related components to avoid SSR issues
// const Editor = dynamic(() => import("./editor1"), { ssr: false });

// let Quill, Delta;

// const QuillComponent = (props) => {
//   const [range, setRange] = useState();
//   const [lastChange, setLastChange] = useState();
//   const [readOnly, setReadOnly] = useState(false);
//   const [quillReady, setQuillReady] = useState(false);

//   // Use a ref to access the quill instance directly
//   const quillRef = useRef();

//   useEffect(() => {
//     // Dynamically import Quill only on the client side
//     import("quill").then((module) => {
//       Quill = module.default;
//       Delta = Quill.import("delta");
//       setQuillReady(true);
//     });
//   }, []);

//   if (!quillReady) {
//     return <div>Loading...</div>; // Render a fallback until Quill is loaded
//   }

//   return (
//     <div>
//       {console.log("props.notesData", props.notesData)}
//       <Editor
//         ref={quillRef}
//         // readOnly={readOnly}
//         defaultValue={`${props.notesData}`}
//         // {new Delta()
//         //   .insert('Hello')
//         //   .insert('\n', { header: 1 })
//         //   .insert('Some ')
//         //   .insert('initial', { bold: true })
//         //   .insert(' ')
//         //   .insert('content', { underline: true })
//         //   .insert('\n')}
//         onSelectionChange={setRange}
//         onTextChange={setLastChange}
//       />
//       {/* <div className="controls">
//         <label>
//           Read Only:{' '}
//           <input
//             type="checkbox"
//             checked={readOnly}
//             onChange={(e) => setReadOnly(e.target.checked)}
//           />
//         </label>
//         <button
//           className="controls-right"
//           type="button"
//           onClick={() => {
//             alert(quillRef.current?.getLength());
//           }}
//         >
//           Get Content Length
//         </button>
//       </div>
//       <div className="state">
//         <div className="state-title">Current Range:</div>
//         {range ? JSON.stringify(range) : 'Empty'}
//       </div>
//       <div className="state">
//         <div className="state-title">Last Change:</div>
//         {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
//       </div> */}
//     </div>
//   );
// };

// export default QuillComponent;
