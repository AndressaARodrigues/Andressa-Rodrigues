import { useMemo } from "react";
import { findNodeByPath } from "@/lib/filesystem";
import type { WindowState } from "../WindowManager";
import { useI18n } from "@/lib/i18n";
import { Markdown } from "@/components/desktop/Markdown";
import { README_CONTENT } from "@/lib/content";
import avatar from "@/assets/user.avif";

export function Readme({ window: w }: { window: WindowState }) {
  const path = (w.data?.path as string[] | undefined) ?? ["readme.md"];
  const { tl, t } = useI18n();
  const node = useMemo(() => findNodeByPath(path), [path]);
  const isRoot = path.length === 1 && path[0] === "readme.md";
  const content = isRoot
    ? tl(README_CONTENT)
    : node && node.type === "file"
      ? tl(node.content)
      : "File not found.";

  return (
    <div className="w-full h-full overflow-auto bg-[#fafaf7] dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
      <div className="max-w-2xl mx-auto px-8 py-10 font-serif text-[15px] leading-relaxed">
        {isRoot && (
          <div className="relative float-right ml-4 mb-2 w-24">
            <img
              src={avatar}
              alt="Andressa"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-pink-300 shadow-md"
            />

            <div className="absolute -left-20 top-16 pointer-events-none select-none">
              <svg width="80" height="60" viewBox="0 0 80 60" className="text-pink-500" fill="none">
                <path
                  d="M4 42 C 25 40, 48 30, 64 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M50 12 L 64 8 L 60 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <div
                className="text-pink-500 text-lg -mt-4 -rotate-6 whitespace-nowrap"
                style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}
              >
                {t("thisIsMe")}
              </div>
            </div>
          </div>
        )}
        <Markdown text={content} />
      </div>
    </div>
  );
}
