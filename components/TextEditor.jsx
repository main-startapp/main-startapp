// import Quill from "quill";
// import ImageResize from "quill-image-resize-module-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
// Quill.register("modules/imageResize", ImageResize);

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
  // imageResize: {
  //   // parchment: Quill.import("parchment"),
  //   // modules: ["Resize", "DisplaySize"],
  // },
};

const TextEditor = ({ update, project }) => {
  const handleTextOnChange = (e) => {
    update({
      ...project,
      description: e,
    });
  };
  return (
    <QuillNoSSRWrapper
      modules={modules}
      value={project?.description}
      onChange={(e) => handleTextOnChange(e)}
      theme="snow"
    />
  );
};

export default TextEditor;
