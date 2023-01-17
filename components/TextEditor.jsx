import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { DefaultTextField } from "./Reusable/Resusable";
import { FormControl, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

const TextEditor = ({ update, project, overlay, showOverlay }) => {
  const handleTextOnChange = (e) => {
    update({
      ...project,
      description: e,
    });
  };
  const theme = useTheme();

  const removeOverlay = () => {
    if (overlay) {
      showOverlay(false);
    }
  }


  return (
    <div className="text-container">
      {/* <div className="text-label">Description</div> */}
      <QuillNoSSRWrapper
        modules={modules}
        value={project?.description}
        onChange={(e) => handleTextOnChange(e)}
        theme="snow"
      />
    </div>
  );
};

export default TextEditor;
