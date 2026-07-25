import { useState } from "react";

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let codeBuf: string[] = [];
  let inCode = false;

  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={out.length} className="list-disc pl-6 my-3 space-y-1">
          {listBuf.map((l, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />
          ))}
        </ul>,
      );
      listBuf = [];
    }
  };

  const flushCode = () => {
    if (codeBuf.length) {
      out.push(<CodeBlock key={out.length} code={codeBuf.join("\n")} />);
      codeBuf = [];
    }
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeBuf.push(line);
      return;
    }
    if (line.startsWith("# ")) {
      flushList();
      out.push(
        <h1 key={out.length} className="text-3xl font-bold mt-2 mb-4">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(
        <h2 key={out.length} className="text-xl font-semibold mt-6 mb-2">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ")) listBuf.push(line.slice(2));
    else if (line.startsWith("*") && line.endsWith("*") && line.length > 2) {
      flushList();
      out.push(
        <p key={out.length} className="italic text-neutral-500 my-3">
          {line.slice(1, -1)}
        </p>,
      );
    } else if (line.trim() === "") flushList();
    else {
      flushList();
      out.push(
        <p key={out.length} className="my-2" dangerouslySetInnerHTML={{ __html: inline(line) }} />,
      );
    }
  });
  flushList();
  flushCode();
  return <>{out}</>;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg overflow-hidden my-4 bg-neutral-900 font-mono text-xs not-italic">
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-800">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <button
          onClick={handleCopy}
          className="text-neutral-400 hover:text-white text-[11px] border border-neutral-600 rounded px-2 py-0.5 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-neutral-200 whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function inline(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[13px]">$1</code>',
    )
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-pink-500 hover:text-pink-600 underline underline-offset-2">$1</a>',
    );
}
