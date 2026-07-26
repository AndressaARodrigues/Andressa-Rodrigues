import { useEffect, useRef, useState, type ReactElement } from "react";
import { useWindows } from "./WindowManager";
import { Image as ImageIcon } from "lucide-react";
import { filesystem, type FSNode } from "@/lib/filesystem";
import { cn } from "@/lib/utils";
import { PinkFolder } from "./PinkFolder";
import { FileText } from "./FileText";
import { FilePdf } from "./FilePdf";
import TrashIcon from "@/assets/icons/trashIcon.png";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useSounds } from "@/lib/sounds";
import { useCheatMode } from "@/lib/cheatMode";
import { LAYERS } from "@/lib/layers";

interface IconPos {
  name: string;
  node: FSNode | null;
  x: number;
  y: number;
  kind: "fs" | "trash";
}

type IconKind = "trash" | "folder" | "pdf" | "image" | "text";

const START_X = 40;
const START_Y = 60;
const GAP_Y = 96;
const SPAM_WINDOW_MS = 1500;

function resolveKind(icon: IconPos): IconKind {
  if (icon.kind === "trash") return "trash";
  if (icon.node?.type === "folder") return "folder";
  if (icon.node?.kind === "pdf") return "pdf";
  if (icon.node?.kind === "image") return "image";
  return "text";
}

export function DesktopIcons() {
  const { open } = useWindows();
  const { t } = useI18n();
  const { resolved } = useTheme();
  const { play } = useSounds();
  const { active: cheatActive } = useCheatMode();

  type TKey = Parameters<typeof t>[0];

  const NAME_KEYS: Record<string, TKey> = {
    demo: "demo",
    projects: "projects",
    adventures: "adventures",
    "resume.pdf": "resumePdf",
    "skills.md": "skillsMd",
    Trash: "trash",
  };

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

  const [swallowed, setSwallowed] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; x: number; y: number } | null>(null);

  const drag = useRef<{
    name: string;
    dx: number;
    dy: number;
    moved: boolean;
    startX: number;
    startY: number;
  } | null>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const trashClicks = useRef<number[]>([]);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-desktop-icon]")) setSelected(null);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const iconTone = resolved === "dark" ? "text-white" : "text-neutral-900";
  const labelTone = "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]";
  const shadow =
    resolved === "dark"
      ? "drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
      : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]";

  const ICON_CONFIG: Record<
    IconKind,
    {
      render: () => ReactElement;
      open?: (node: FSNode) => void;
    }
  > = {
    trash: {
      render: () => <img src={TrashIcon} alt="Trash" className={cn("size-12", shadow)} />,
    },
    folder: {
      render: () => <PinkFolder className={cn("w-14 h-12", shadow)} />,
      open: (node) => open("finder", { title: node.name, data: { path: [node.name] } }),
    },
    pdf: {
      render: () => <FilePdf className={cn("w-10 h-10", iconTone, shadow)} />,
      open: (node) => open("pdf", { title: node.name }),
    },
    image: {
      render: () => <ImageIcon className={cn("w-10 h-10", iconTone, shadow)} />,
      open: (node) => open("imageviewer", { title: node.name }),
    },
    text: {
      render: () => <FileText className={cn("w-10 h-10", iconTone, shadow)} />,
      open: (node) => open("readme", { title: node.name, data: { path: [node.name] } }),
    },
  };

  const openIcon = (icon: IconPos) => {
    if (icon.kind === "trash") return;
    const node = icon.node;
    if (!node) return;
    ICON_CONFIG[resolveKind(icon)].open?.(node);
  };

  const displayName = (name: string) => {
    const key = NAME_KEYS[name];
    return key ? t(key) : name;
  };

  const showToast = (message: string) => {
    const trash = icons.find((i) => i.kind === "trash");
    if (!trash) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ message, x: trash.x, y: trash.y });
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  };

  const handleTrashClick = () => {
    const now = Date.now();
    trashClicks.current = [...trashClicks.current, now].filter((ts) => now - ts < SPAM_WINDOW_MS);
    const count = trashClicks.current.length;
    if (count === 2) {
      play("click");
      showToast(t("trashSpam1"));
    } else if (count === 3) {
      play("click");
      showToast(t("trashSpam2"));
    } else if (count >= 4) {
      play("click");
      showToast(t("trashSpam3"));
      trashClicks.current = [];
    }
  };

  const overlapsTrash = (name: string) => {
    const el = iconRefs.current[name];
    const trashEl = iconRefs.current["Trash"];
    if (!el || !trashEl) return false;
    const a = el.getBoundingClientRect();
    const b = trashEl.getBoundingClientRect();
    return !(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top);
  };

  const swallowIcon = (name: string, originalX: number, originalY: number) => {
    play("crumple");
    setSwallowed(name);
    window.setTimeout(() => {
      setIcons((prev) =>
        prev.map((i) => (i.name === name ? { ...i, x: originalX, y: originalY } : i)),
      );
      window.setTimeout(() => {
        setSwallowed(null);
        showToast(t("trashReturnMessage"));
      }, 30);
    }, 350);
  };

  return (
    <>
      {icons.map((icon) => {
        const isSelected = selected === icon.name;
        const kind = resolveKind(icon);
        const isSwallowed = swallowed === icon.name;

        return (
          <button
            key={icon.name}
            data-desktop-icon
            ref={(el) => {
              iconRefs.current[icon.name] = el;
            }}
            style={{ left: icon.x, top: icon.y, zIndex: LAYERS.desktop }}
            className={cn(
              "absolute w-20 flex flex-col items-center gap-1 p-1.5 rounded-md select-none group transition-[opacity,transform] duration-300",
              isSelected && "bg-white/25 outline-1 outline-white/60",
              isSwallowed && "opacity-0 scale-50 pointer-events-none",
            )}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = {
                name: icon.name,
                dx: e.clientX - icon.x,
                dy: e.clientY - icon.y,
                moved: false,
                startX: icon.x,
                startY: icon.y,
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
              const el = e.target as HTMLElement;
              if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
              const d = drag.current;
              drag.current = null;
              if (!d) return;

              if (icon.kind === "trash") {
                if (!d.moved) handleTrashClick();
                return;
              }

              if (d.moved && overlapsTrash(icon.name)) {
                swallowIcon(icon.name, d.startX, d.startY);
              }
            }}
            onDoubleClick={() => openIcon(icon)}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              {ICON_CONFIG[kind].render()}
            </div>
            <div className={cn("text-xs px-1 rounded text-center leading-tight", labelTone)}>
              {displayName(icon.name)}
            </div>
          </button>
        );
      })}

      {toast && (
        <div
          className="absolute px-3 py-1.5 rounded-lg text-xs font-medium bg-black/80 text-white whitespace-nowrap shadow-lg animate-fade-in pointer-events-none"
          style={{ left: toast.x + 90, top: toast.y + 10, zIndex: LAYERS.desktop + 1 }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
