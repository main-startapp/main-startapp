import React, { useState, useEffect } from "react";
import { useQuill, setContents } from "react-quilljs";
import "quill/dist/quill.snow.css";

const TextEditor = ({ update, project }) => {
  // const theme = "snow";

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };
  // const formats = ["bold", "italic", "underline", "strike"];
  // const placeholder = "insert text here";

  const { quill, quillRef } = useQuill({
    // theme,
    modules,
  });

  useEffect(() => {
    // console.log(quill.container.style); // maybe update style from here????
    if (quill) {
      quill.setContents("");
      quill.on("text-change", () => {
        console.log("changed");
        // update({
        //   ...project,
        //   description: quill.container.firstChild.innerHTML,
        // });
        console.log(quill.container.firstChild.innerHTML);
      });
    }
  }, [quill]);

  return (
    <div id="quill-container">
      <div ref={quillRef}></div>
    </div>
  );
};

export default TextEditor;
