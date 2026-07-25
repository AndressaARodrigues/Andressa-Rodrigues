import { useMemo } from "react";
import { findNodeByPath } from "@/lib/filesystem";
import type { WindowState } from "../WindowManager";
import { useI18n } from "@/lib/i18n";
import { Markdown } from "@/components/desktop/Markdown";
import avatar from "@/assets/andressa.jpeg.asset.json";

export function Readme({ window: w }: { window: WindowState }) {
  const path = (w.data?.path as string[] | undefined) ?? ["readme.md"];
  const { t, tl } = useI18n();
  const node = useMemo(() => findNodeByPath(path), [path]);
  const isRoot = path.length === 1 && path[0] === "readme.md";
  const content = isRoot
    ? t("readmeContent")
    : node && node.type === "file"
      ? tl(node.content)
      : "File not found.";

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
