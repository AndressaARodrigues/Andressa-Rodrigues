import { useMemo, useState } from "react";
import { filesystem, findNodeByPath, type FSNode } from "@/lib/filesystem";
import { useWindows, type WindowState } from "../WindowManager";
import {
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Home,
  HardDrive,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PinkFolder } from "../PinkFolder";
import { FileText } from "../FileText";
import { FilePdf } from "../FilePdf";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Finder({ window: w }: { window: WindowState }) {
  const { updateData, open } = useWindows();
  const { t } = useI18n();
  const path = (w.data?.path as string[] | undefined) ?? [];
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");

  const current = useMemo(() => {
    const node = findNodeByPath(path);
    return node && node.type === "folder" ? node : filesystem;
  }, [path]);

  const items = current.children.filter(
    (c) => !c.hidden && (q ? c.name.toLowerCase().includes(q.toLowerCase()) : true),
  );

  const navigate = (nextPath: string[]) => updateData(w.id, { path: nextPath });

  const openItem = (n: FSNode) => {
    if (n.type === "folder") navigate([...path, n.name]);
    else if (n.kind === "pdf") open("pdf", { title: n.name });
    else if (n.kind === "image")
      open("imageviewer", { title: n.name, data: { pictureId: n.name.replace(/\.jpg$/, "") } });
    else open("readme", { title: n.name, data: { path: [...path, n.name] } });
  };

  const displayName = (name: string) => {
    if (name === "demo") return t("demo");
    if (name === "projects") return t("projects");
    if (name === "adventures") return t("adventures");
    if (name === "resume.pdf") return t("resumePdf");
    if (name === "skills.md") return t("skillsMd");
    return name;
  };

  const sidebarSections: { label: string; path: string[] }[] = [
    { label: t("home"), path: [] },
    { label: t("demo"), path: ["demo"] },
    { label: t("projects"), path: ["projects"] },
    { label: t("adventures"), path: ["adventures"] },
  ];

  return (
    <div className="w-full h-full flex text-sm bg-card text-foreground">
      <aside className="w-44 border-r border-black/10 dark:border-white/10 bg-neutral-50/80 dark:bg-neutral-900/80 p-2 flex flex-col gap-4 text-xs">
        <div>
          <div className="text-muted-foreground font-medium px-2 mb-1">{t("favorites")}</div>
          {sidebarSections.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.path)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5",
                JSON.stringify(path) === JSON.stringify(s.path) &&
                  "bg-blue-500 text-white hover:bg-blue-500",
              )}
            >
              {s.path.length === 0 ? (
                <Home className="w-3.5 h-3.5" />
              ) : (
                <PinkFolder className="w-4 h-3.5" />
              )}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        <div>
          <div className="text-muted-foreground font-medium px-2 mb-1">{t("locations")}</div>
          <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
            <HardDrive className="w-3.5 h-3.5" /> Macintosh HD
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 border-b border-black/10 dark:border-white/10 flex items-center gap-2 px-3 bg-neutral-50/80 dark:bg-neutral-900/80">
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
            <button onClick={() => navigate([])} className="hover:underline">
              ~
            </button>
            {path.map((seg, i) => (
              <span key={i} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="w-3 h-3" />
                <button
                  onClick={() => navigate(path.slice(0, i + 1))}
                  className="hover:underline truncate"
                >
                  {displayName(seg)}
                </button>
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center rounded bg-background border border-black/10 dark:border-white/10 px-2 h-6 gap-1">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="bg-transparent outline-none text-xs w-28"
            />
          </div>
          <div className="flex items-center rounded border border-black/10 dark:border-white/10 overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={cn("p-1", view === "grid" && "bg-neutral-200 dark:bg-neutral-800")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-1", view === "list" && "bg-neutral-200 dark:bg-neutral-800")}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {view === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
              {items.map((n) => (
                <button
                  key={n.name}
                  onDoubleClick={() => openItem(n)}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 outline-none"
                >
                  <NodeIcon node={n} large />
                  <div className="text-xs text-center break-all leading-tight">
                    {displayName(n.name)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {items.map((n) => (
                <button
                  key={n.name}
                  onDoubleClick={() => openItem(n)}
                  className="w-full flex items-center gap-3 py-1.5 px-2 rounded hover:bg-black/5 dark:hover:bg-white/5 text-left"
                >
                  <NodeIcon node={n} />
                  <div className="flex-1 text-sm truncate">{displayName(n.name)}</div>
                  <div className="text-xs text-muted-foreground">
                    {n.type === "folder" ? t("folder") : t("file")}
                  </div>
                </button>
              ))}
            </div>
          )}
          {items.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10">{t("noItems")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function NodeIcon({ node, large }: { node: FSNode; large?: boolean }) {
  const { resolved } = useTheme();
  const shadow =
    resolved === "dark"
      ? "drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
      : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]";

  const size = large ? "w-12 h-12" : "w-5 h-5";
  if (node.type === "folder") return <PinkFolder className={large ? "w-12 h-10" : "w-5 h-4"} />;
  if (node.kind === "pdf") return <FilePdf className={cn(size, shadow)} />;
  if (node.kind === "image") {
    return (
      <div
        className={cn(
          large ? "w-12 h-12" : "w-5 h-5",
          "rounded overflow-hidden border border-black/10 bg-neutral-100 flex items-center justify-center",
        )}
      >
        {node.src ? (
          <img src={node.src} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-4 h-4 text-neutral-400" />
        )}
      </div>
    );
  }
  return <FileText className={cn(size, shadow)} />;
}
