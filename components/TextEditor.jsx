import "react-quill/dist/quill.snow.css";
// import Quill from "quill";
// import ImageResize from "quill-image-resize-module-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Quill.register("modules/imageResize", ImageResize);

const TextEditor = ({ update, project }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    // imageResize: {
    //   // parchment: Quill.import("parchment"),
    //   // modules: ["Resize", "DisplaySize"],
    // },
  };

  const handleTextOnChange = (e) => {
    update({
      ...project,
      description: e,
    });
  };

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={project?.description}
      onChange={(e) => handleTextOnChange(e)}
    />
  );
};

export default TextEditor;
