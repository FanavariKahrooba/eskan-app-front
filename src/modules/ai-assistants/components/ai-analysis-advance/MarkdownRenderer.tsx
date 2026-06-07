"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Button } from "../ui/button";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const rawCode = String(children ?? "").replace(/\n$/, "");
  const language = className?.replace("language-", "") || "code";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-border bg-zinc-950">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] uppercase tracking-wide text-zinc-400">
          {language}
        </span>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleCopy}
          className="h-7 px-2 text-[11px]"
        >
          {copied ? "کپی شد" : "کپی"}
        </Button>
      </div>

      <pre className="overflow-x-auto p-4 text-xs leading-7 text-zinc-100">
        <code className={className}>{rawCode}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-bold prose-p:leading-8 prose-li:leading-8 prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-r-2 prose-blockquote:border-primary prose-blockquote:pr-4 prose-hr:border-border prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-extrabold text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-foreground">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-8 text-foreground/90">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pr-5 text-sm text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pr-5 text-sm text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-xl bg-muted/40 py-2">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          code(props) {
            const { className, children, ...rest } = props;
            const isBlock =
              typeof className === "string" &&
              className.startsWith("language-");

            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }

            return (
              <code
                {...rest}
                className="rounded bg-muted px-1.5 py-0.5 text-[12px] text-foreground"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
