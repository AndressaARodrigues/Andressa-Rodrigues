import { useMemo } from "react";
import { findNodeByPath } from "@/lib/filesystem";
import type { WindowState } from "../WindowManager";
import { useI18n } from "@/lib/i18n";
import avatar from "@/assets/andressa.jpeg.asset.json";

export function Readme({ window: w }: { window: WindowState }) {
  const path = (w.data?.path as string[] | undefined) ?? ["readme.md"];
  const { t } = useI18n();
  const node = useMemo(() => findNodeByPath(path), [path]);
  const isRoot = path.length === 1 && path[0] === "readme.md";
  const content = isRoot ? t("readmeContent") : (node && node.type === "file" ? node.content ?? "" : "File not found.");

  return (
    <div className="w-full h-full overflow-auto bg-[#fafaf7] dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
      <div className="max-w-2xl mx-auto px-8 py-10 font-serif text-[15px] leading-relaxed">
        {isRoot && (
          <div className="flex items-center gap-4 mb-6">
            <img
              src={avatar.url}
              alt="Andressa"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-pink-300 shadow-md"
            />
            <div>
              <div className="text-2xl font-semibold">Andressa</div>
              <div className="text-sm text-muted-foreground">Porto Alegre, BR</div>
            </div>
          </div>
        )}
        <Markdown text={content} />
      </div>
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
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
  lines.forEach((line, idx) => {
    if (line.startsWith("# ")) { flushList(); out.push(<h1 key={idx} className="text-3xl font-bold mt-2 mb-4">{line.slice(2)}</h1>); }
    else if (line.startsWith("## ")) { flushList(); out.push(<h2 key={idx} className="text-xl font-semibold mt-6 mb-2">{line.slice(3)}</h2>); }
    else if (line.startsWith("- ")) listBuf.push(line.slice(2));
    else if (line.startsWith("*") && line.endsWith("*") && line.length > 2) { flushList(); out.push(<p key={idx} className="italic text-neutral-500 my-3">{line.slice(1,-1)}</p>); }
    else if (line.trim() === "") flushList();
    else { flushList(); out.push(<p key={idx} className="my-2" dangerouslySetInnerHTML={{ __html: inline(line) }} />); }
  });
  flushList();
  return <>{out}</>;
}

function inline(s: string) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[13px]">$1</code>');
}
