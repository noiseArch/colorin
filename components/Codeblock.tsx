import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  language: string;
  text: string;
};

export default function CodeBlock({ language, text }: Props) {
  return (
    <SyntaxHighlighter
      language={language}
      customStyle={{ overflowX: "auto" }}
      style={dracula}>
      {text}
    </SyntaxHighlighter>
  );
}
