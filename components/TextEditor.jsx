import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(import("react-quill"), { ssr: false });

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
    <div className="text-container">
      {/* <div className="text-label">Description</div> */}
      <QuillNoSSRWrapper
        modules={modules}
        placeholder="Description"
        theme="snow"
        value={project?.description}
        onChange={(e) => handleTextOnChange(e)}
      />
    </div>
  );
};

export default TextEditor;
