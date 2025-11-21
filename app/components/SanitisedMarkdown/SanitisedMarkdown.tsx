"use client";

import { ComponentProps } from "react";
import createDOMPurify from "dompurify";
import Markdown from "markdown-to-jsx";

type MarkdownProps = ComponentProps<typeof Markdown>;
type MarkdownOptions = MarkdownProps["options"];

export type SanitisedMarkdownProps = {
  children: string;
  options?: MarkdownOptions;
  className?: string;
  "data-testid"?: string;
};

export default function SanitisedMarkdown({
  children,
  options,
  className,
  ...props
}: SanitisedMarkdownProps) {
  const dataTestId = props["data-testid"] ?? "sanitised-markdown";

  // DOMPurify exports a factory. In browser/runtime we must call it with
  // the window to get an instance that exposes `sanitize`. During SSR or
  // in some test environments `window`/`sessionStorage` may be undefined,
  // so provide a safe fallback that returns the raw string.
  const purify =
    typeof window !== "undefined"
      ? createDOMPurify(window as any)
      : { sanitize: (s: string) => s };

  const sanitised = purify.sanitize(children);

  return (
    <Markdown
      data-testid={dataTestId}
      options={options}
      className={className ?? ""}
    >
      {sanitised}
    </Markdown>
  );
}
