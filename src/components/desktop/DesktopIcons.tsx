import { useEffect, useRef, useState } from "react";
import { useWindows } from "./WindowManager";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { filesystem, type FSNode } from "@/lib/filesystem";
import { cn } from "@/lib/utils";
import { PinkFolder } from "./PinkFolder";
import { FileText } from "./FileText";
import { FilePdf } from "./FilePdf";
import TrashIcon from "@/assets/icons/trashIcon.png";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useSounds } from "@/lib/sounds";
import { LAYERS } from "@/lib/layers";

interface IconPos {
  name: string;
  node: FSNode | null;
  x: number;
  y: number;
  kind: "fs" | "trash";
}

const START_X = 40;
const START_Y = 60;
const GAP_Y = 96;

export function DesktopIcons() {
  const { open } = useWindows();
  const { t } = useI18n();
  const { resolved } = useTheme();
  const { play } = useSounds();

  const [selected, setSelected] = useState<string | null>(null);
  const [icons, setIcons] = useState<IconPos[]>(() => {
    const items: IconPos[] = filesystem.children
      .filter((c) => !c.hidden)
      .map((c, i) => ({ name: c.name, node: c, x: START_X, y: START_Y + i * GAP_Y, kind: "fs" }));
    items.push({
      name: "Trash",
      node: null,
      x: START_X,
      y: START_Y + items.length * GAP_Y,
      kind: "trash",
    });
    return items;
  });
  const drag = useRef<{ name: string; dx: number; dy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-desktop-icon]")) setSelected(null);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const openIcon = (icon: IconPos) => {
    if (icon.kind === "trash") return;
    const node = icon.node;
    if (!node) return;
    if (node.type === "folder") open("finder", { title: node.name, data: { path: [node.name] } });
    else if (node.kind === "pdf") open("pdf", { title: node.name });
    else if (node.kind === "image") open("imageviewer", { title: node.name });
    else open("readme", { title: node.name, data: { path: [node.name] } });
  };

  const displayName = (name: string) => {
    if (name === "demo") return t("demo");
    if (name === "projects") return t("projects");
    if (name === "adventures") return t("adventures");
    if (name === "resume.pdf") return t("resumePdf");
    if (name === "Trash") return t("trash");
    return name;
  };

  const iconTone = resolved === "dark" ? "text-white" : "text-neutral-900";
  const labelTone = "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]";
  const shadow =
    resolved === "dark"
      ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
      : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]";

  return (
    <>
      {icons.map((icon) => {
        const isSelected = selected === icon.name;
        const renderIcon = () => {
          if (icon.kind === "trash")
            return <img src={TrashIcon} alt="Trash" className={cn("size-12", shadow)} />;
          if (icon.node?.type === "folder")
            return <PinkFolder className={cn("w-12 h-10", shadow)} />;
          if (icon.node?.kind === "pdf")
            return <FilePdf className={cn("w-9 h-9", iconTone, shadow)} />;
          if (icon.node?.kind === "image")
            return <ImageIcon className={cn("w-9 h-9", iconTone, shadow)} />;
          return <FileText className={cn("w-9 h-9", iconTone, shadow)} />;
        };
        return (
          <button
            key={icon.name}
            data-desktop-icon
            style={{ left: icon.x, top: icon.y, zIndex: LAYERS.desktop }}
            className={cn(
              "absolute w-20 flex flex-col items-center gap-1 p-1.5 rounded-md select-none group",
              isSelected && "bg-white/25 outline-1 outline-white/60",
            )}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = {
                name: icon.name,
                dx: e.clientX - icon.x,
                dy: e.clientY - icon.y,
                moved: false,
              };
              if (selected !== icon.name) play("click");
              setSelected(icon.name);
            }}
            onPointerMove={(e) => {
              if (!drag.current || drag.current.name !== icon.name) return;
              const nx = e.clientX - drag.current.dx;
              const ny = e.clientY - drag.current.dy;
              if (Math.abs(nx - icon.x) > 3 || Math.abs(ny - icon.y) > 3) drag.current.moved = true;
              setIcons((prev) =>
                prev.map((i) => (i.name === icon.name ? { ...i, x: nx, y: ny } : i)),
              );
            }}
            onPointerUp={(e) => {
              try {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {
                /* noop */
              }
              drag.current = null;
            }}
            onDoubleClick={() => openIcon(icon)}
          >
            <div className="w-12 h-12 flex items-center justify-center">{renderIcon()}</div>
            <div className={cn("text-xs px-1 rounded text-center leading-tight", labelTone)}>
              {displayName(icon.name)}
            </div>
          </button>
        );
      })}
    </>
  );
}
