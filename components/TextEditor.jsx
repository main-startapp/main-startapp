import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  ReactDOM,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  ["link", "image"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"], // remove formatting butto
];

const TextEditor = () => {
  const [quill, setQuill] = useState();
  const [description, setDescription] = useState("");

  const handleOnChange = () => {
    console.log("hi");
  };

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        console.log(quill.container.firstChild.innerHTML);
        setDescription(quill.container.firstChild.innerHTML);
      });
    }
  }, [quill]);

  const rteWrapper = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    setQuill(
      new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      })
    );
  }, []);

  return (
    <div
      id="rte-container"
      style={{
        border: "solid #f0f0f0 9px",
        borderRadius: "8px",
        backgroundColor: "#dbdbdb",
      }}
      ref={rteWrapper}
    ></div>
  );
};

export default TextEditor;
