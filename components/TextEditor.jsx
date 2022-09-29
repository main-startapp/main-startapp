import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

const TextEditor = ({ update, project }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    imageResize: {
      // parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  const handleTextOnChange = (e) => {
    update({
      ...project,
      description: e,
    });
  };

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      onChange={(e) => handleTextOnChange(e)}
      style={{
        backgroundColor: "#f0f0f0",
        border: "4px solid #cccccc",
        borderRadius: "10px",
      }}
    />
  );
};

export default TextEditor;
