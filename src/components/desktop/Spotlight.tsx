import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useWindows, type AppId } from "./WindowManager";
import { useI18n } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { filesystem, type FSNode, type FSFolder } from "@/lib/filesystem";
import { cn } from "@/lib/utils";

interface Result {
  id: string;
  label: string;
  sub: string;
  action: () => void;
}

export function Spotlight({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: openWin } = useWindows();
  const { t } = useI18n();
  const { play } = useSounds();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const items = useMemo<Result[]>(() => {
    const list: Result[] = [];
    const app = (id: AppId, label: string, sub: string, data?: Record<string, unknown>) =>
      list.push({ id: `app-${id}-${label}`, label, sub, action: () => openWin(id, data ? { data } : undefined) });

    app("finder", t("finder"), "Application");
    app("terminal", t("terminal"), "Application");
    app("messages", t("messages"), "Application");
    app("music", t("music"), "Application");
    app("mail", t("mail"), "Application");
    app("readme", t("aboutMe"), "Document");
    app("pdf", t("resumePdf"), "PDF");
    app("solitaire", t("solitaire"), "Game");
    app("settings", t("settings"), "System");

    // Walk filesystem
    const walk = (node: FSNode, path: string[]) => {
      if (node.type === "folder") {
        for (const child of node.children) walk(child, [...path, node.name]);
      } else {
        const parent = path.slice(1).join("/") || "~";
        if (node.kind === "pdf") {
          list.push({ id: `f-${path.join("/")}/${node.name}`, label: node.name, sub: `PDF · ${parent}`, action: () => openWin("pdf") });
        } else if (node.kind === "image") {
          list.push({ id: `f-${path.join("/")}/${node.name}`, label: node.name, sub: `Photo · ${parent}`, action: () => openWin("imageviewer", { data: { src: node.src, caption: node.caption } }) });
        } else {
          list.push({ id: `f-${path.join("/")}/${node.name}`, label: node.name, sub: `File · ${parent}`, action: () => openWin("finder", { data: { path } }) });
        }
      }
    };
    walk(filesystem as FSFolder, []);
    return list;
  }, [openWin, t]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 8);
    const needle = q.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(needle) || i.sub.toLowerCase().includes(needle)).slice(0, 10);
  }, [items, q]);

  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;

  const commit = (idx: number) => {
    const r = filtered[idx];
    if (!r) return;
    play("click");
    r.action();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-start justify-center pt-[18vh] bg-black/20 backdrop-blur-md animate-fade-in"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[min(640px,92vw)] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/10">
          <Search size={20} className="opacity-60" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); commit(sel); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
            placeholder={t("spotlightPlaceholder")}
            className="flex-1 bg-transparent outline-none text-lg placeholder:opacity-40 text-foreground"
          />
        </div>
        {filtered.length > 0 && (
          <div className="max-h-[50vh] overflow-auto py-1">
            {filtered.map((r, i) => (
              <button
                key={r.id}
                onMouseEnter={() => setSel(i)}
                onClick={() => commit(i)}
                className={cn(
                  "w-full text-left px-4 py-2 flex items-center justify-between gap-4",
                  i === sel ? "bg-blue-500 text-white" : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground",
                )}
              >
                <span className="truncate font-medium">{r.label}</span>
                <span className={cn("text-xs truncate", i === sel ? "text-white/80" : "opacity-60")}>{r.sub}</span>
              </button>
            ))}
          </div>
        )}
        {q && filtered.length === 0 && (
          <div className="px-4 py-6 text-sm opacity-60 text-center">{t("spotlightNoResults")}</div>
        )}
      </div>
    </div>
  );
}
