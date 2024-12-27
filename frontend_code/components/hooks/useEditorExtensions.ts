import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Lowlight } from "lowlight";

export const useEditorExtensions = (lowlight: Lowlight) => {
  return [
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    BulletList.configure({
      keepMarks: true,
      keepAttributes: false,
    }),
    OrderedList.configure({
      keepMarks: true,
      keepAttributes: false,
    }),
    ListItem,
    Image,
    Link.configure({
      openOnClick: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: "rounded-md",
      },
    }),
    Highlight.configure({
      multicolor: true,
    }),
    FontFamily,
    TextStyle,
    Typography,
  ] as Extension[];
};
