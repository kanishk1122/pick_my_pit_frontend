import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import BlogTheme from "./themes/BlogTheme";
import "./blog-detail.css";

const LexicalContentViewer = ({ content }) => {
  const editorConfig = {
    namespace: "BlogDetailEditor",
    theme: BlogTheme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: content ? JSON.stringify(content) : undefined,
    onError: (error) => console.error("Editor error:", error),
    editable: false, // Read-only mode
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="blog-detail-editor outline-none" />
        }
        placeholder={<div className="text-stone-400">No content</div>}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
};

export default LexicalContentViewer;
