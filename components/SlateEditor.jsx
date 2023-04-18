// react
import { forwardRef, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
// slate
import {
  createEditor,
  Editor,
  Range,
  Transforms,
  Node,
  Element as SlateElement,
} from "slate";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useFocused,
  useSelected,
} from "slate-react";
import { withHistory } from "slate-history";
// misc lib
import isHotkey, { isKeyHotkey } from "is-hotkey";
import isUrl from "is-url";
// emotion
import { cx, css } from "@emotion/css";
// icons
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdImage,
  MdLooksOne,
  MdLooksTwo,
  MdOndemandVideo,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from "react-icons/md";

// org: https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx
const MARK_HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};
const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
const ICON_SIZE = 24;
const URL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

const SlateEditor = ({ valueObj, valueKey, onChange, isReadOnly }) => {
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate
      editor={editor}
      value={valueObj[valueKey] || initialValue}
      onChange={(newValue) => {
        if (!isReadOnly) onChange({ ...valueObj, [valueKey]: newValue });
      }}
    >
      <HoveringToolbar>
        <MarkButton format="bold" icon={<MdFormatBold size={ICON_SIZE} />} />
        <MarkButton
          format="italic"
          icon={<MdFormatItalic size={ICON_SIZE} />}
        />
        <MarkButton
          format="underline"
          icon={<MdFormatUnderlined size={ICON_SIZE} />}
        />
        <MarkButton format="code" icon={<MdCode size={ICON_SIZE} />} />
        <BlockButton
          format="heading-one"
          icon={<MdLooksOne size={ICON_SIZE} />}
        />
        <BlockButton
          format="heading-two"
          icon={<MdLooksTwo size={ICON_SIZE} />}
        />
        <BlockButton
          format="block-quote"
          icon={<MdFormatQuote size={ICON_SIZE} />}
        />
        <BlockButton
          format="numbered-list"
          icon={<MdFormatListNumbered size={ICON_SIZE} />}
        />
        <BlockButton
          format="bulleted-list"
          icon={<MdFormatListBulleted size={ICON_SIZE} />}
        />
        <BlockButton
          format="left"
          icon={<MdFormatAlignLeft size={ICON_SIZE} />}
        />
        <BlockButton
          format="center"
          icon={<MdFormatAlignCenter size={ICON_SIZE} />}
        />
        <BlockButton
          format="right"
          icon={<MdFormatAlignRight size={ICON_SIZE} />}
        />
        <BlockButton
          format="justify"
          icon={<MdFormatAlignJustify size={ICON_SIZE} />}
        />
      </HoveringToolbar>
      <Editable
        style={{ minHeight: isReadOnly ? 0 : "200px" }}
        spellCheck
        renderElement={(props) => <Element {...props} />}
        renderLeaf={(props) => <Leaf {...props} />}
        readOnly={isReadOnly}
        decorate={urlDecorator}
        placeholder={
          isReadOnly ? null : (
            <span style={{ fontWeight: 600, color: "black" }}>
              Description *
            </span>
          )
        }
        onKeyDown={(event) => {
          const { selection } = editor;
          if (selection && Range.isCollapsed(selection)) {
            const { nativeEvent } = event;
            if (isKeyHotkey("left", nativeEvent)) {
              event.preventDefault();
              Transforms.move(editor, { unit: "offset", reverse: true });
              return;
            }
            if (isKeyHotkey("right", nativeEvent)) {
              event.preventDefault();
              Transforms.move(editor, { unit: "offset" });
              return;
            }
          }
          for (const hotkey in MARK_HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = MARK_HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
          if (isHotkey("mod+enter", event)) {
            event.preventDefault();
            const { selection } = editor;

            if (selection) {
              const [start] = Range.edges(selection);
              const line = Editor.node(editor, start);

              Transforms.insertNodes(
                editor,
                { type: "paragraph", children: [{ text: "" }] },
                { at: Editor.end(editor, line[1]), select: true }
              );
            }
          }
        }}
      />
    </Slate>
  );
};

// block and mark
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// decoration
// https://isamatov.com/slate-react-links-auto-format/
export const findUrlsInText = (text) => {
  const matches = text.match(URL_REGEX);

  return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
};

const urlDecorator = ([node, path]) => {
  const nodeText = node.text;

  if (!nodeText || isUrl(nodeText)) return []; // don't decorate if null or the whole text is url (this will be taken care of by withInlines)

  const urls = findUrlsInText(nodeText);

  return urls.map(([url, index]) => {
    return {
      anchor: {
        path,
        offset: index,
      },
      focus: {
        path,
        offset: index + url.length,
      },
      decoration: "link",
    };
  });
};

// inlines plugin
const withInlines = (editor) => {
  const { isInline, insertText, insertData, normalizeNode } = editor;

  editor.isInline = (element) =>
    ["link"].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  editor.normalizeNode = (entry) => {
    // https://stackoverflow.com/questions/68511348/unable-to-delete-a-link-clearly-in-slate-js-editor-using-the-official-example
    const [node, path] = entry;

    if (SlateElement.isElement(node) && node.type === "paragraph") {
      const children = Array.from(Node.children(editor, path));
      for (const [child, childPath] of children) {
        // remove link nodes whose text value is empty string.
        // empty text links happen when you move from link to next line or delete link line.
        if (
          SlateElement.isElement(child) &&
          child.type === "link" &&
          child.children[0].text === ""
        ) {
          if (children.length === 1) {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(editor, {
              type: "paragraph",
              children: [{ text: "" }],
            });
          } else {
            Transforms.removeNodes(editor, { at: childPath });
          }
          return;
        }
      }
    }
    normalizeNode(entry);
  };

  return editor;
};

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return !!link;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

// comp
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <SlateButton
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </SlateButton>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <SlateButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </SlateButton>
  );
};

const HoveringToolbar = ({ children }) => {
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 16}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <SlatePortal>
      <SlateMenu
        ref={ref}
        className={css`
          position: absolute;
          top: -10000px;
          left: -10000px;
          z-index: 5;
          background-color: #fff;
          display: flex;
          box-shadow: 2px 2px 10px #aaa;
          border-radius: 8px;
          padding-left: 4px;
          padding-right: 4px;
          opacity: 0;
          transition: opacity 0.75s;
        `}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        {children}
      </SlateMenu>
    </SlatePortal>
  );
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
      font-size: 0;
    `}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const LinkComponent = ({ attributes, children, element }) => {
  const selected = useSelected();
  return (
    <a
      {...attributes}
      target="_blank"
      href={element.url}
      rel="noreferrer"
      className={
        selected
          ? css`
              box-shadow: 0 0 0 2px #0366d6;
            `
          : css`
              cursor: pointer;
              color: rgb(3, 102, 214);
            `
      }
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

// element and leaf
const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  const blockquoteStyle = {
    textAlign: element.align,
    borderLeft: "2px solid #ddd",
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: "16px",
    color: "#aaa",
    fontStyle: "italic",
  };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={blockquoteStyle} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "link":
      return <LinkComponent {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.decoration === "link") {
    children = (
      <a
        style={{ cursor: "pointer", color: "rgb(3, 102, 214)" }}
        {...attributes}
        target="_blank"
        href={leaf.text}
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      className={
        leaf.text === ""
          ? css`
              padding-left: 0.1px;
            `
          : null
      }
      {...attributes}
    >
      {children}
    </span>
  );
};

// init value if no input value
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default SlateEditor;

// styling comp
const SlateButton = forwardRef(function SlateButton(
  { className, active, reversed, ...props },
  ref
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
            ? "black"
            : "#ccc"};
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
        `
      )}
    />
  );
});

const SlateMenu = forwardRef(function SlateMenu({ className, ...props }, ref) {
  return (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }
          // & > * + * {
          //   margin-left: 16px;
          // }
        `
      )}
    />
  );
});

const SlateToolbar = forwardRef(function SlateToolbar(
  { className, ...props },
  ref
) {
  return (
    <SlateMenu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          // padding: 1px 18px 17px;
          // margin: 0 -20px;
          // border-bottom: 2px solid #eee;
          // margin-bottom: 20px;
          display: flex;
          flex-direction: row;
        `
      )}
    />
  );
});

const SlatePortal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
