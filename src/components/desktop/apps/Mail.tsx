import { useState, useEffect, useMemo } from "react";
import { Star, Inbox, Send, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECOMMENDATIONS } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { Markdown } from "@/components/desktop/Markdown";
import { formatEmailDate } from "@/lib/date";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  role: string;
  preview: string;
  body: string;
  date: string;
  starred?: boolean;
}

export function MailApp() {
  const { lang, t, tl } = useI18n();

  const emails: Email[] = useMemo(
    () =>
      RECOMMENDATIONS.map((r) => ({
        id: r.id,
        from: r.from,
        fromEmail: r.fromEmail,
        date: formatEmailDate(r.date, lang),
        starred: r.starred,
        role: r.role,
        preview: tl(r.preview),
        body: tl(r.body),
      })),
    [lang, tl],
  );

  const [selected, setSelected] = useState<Email>(emails[0]);

  useEffect(() => {
    setSelected((prev) => emails.find((e) => e.id === prev.id) ?? emails[0]);
  }, [emails]);

  return (
    <div className="w-full h-full flex text-sm">
      <aside className="w-40 border-r border-black/10 bg-neutral-50/80 p-2 text-xs flex flex-col gap-1">
        <Item
          icon={<Inbox className="w-3.5 h-3.5" />}
          label={t("inbox")}
          count={emails.length}
          active
        />
        <Item icon={<Star className="w-3.5 h-3.5" />} label={t("starred")} />
        <Item icon={<Send className="w-3.5 h-3.5" />} label={t("sent")} />
        <Item icon={<Archive className="w-3.5 h-3.5" />} label={t("archive")} />
        <Item icon={<Trash2 className="w-3.5 h-3.5" />} label={t("trash")} />
      </aside>
      <div className="w-64 border-r border-black/10 overflow-auto">
        {emails.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className={cn(
              "w-full text-left px-3 py-2 border-b border-black/5 hover:bg-black/5",
              selected.id === e.id && "bg-blue-500 text-white hover:bg-blue-500",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">{e.from}</span>
              <span className="text-[11px] opacity-70">{e.date}</span>
            </div>
            <div className="text-[11px] truncate opacity-70">{e.preview}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="text-xs text-neutral-500">{selected.date}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center text-xs font-medium">
            {selected.from
              .split(" ")
              .map((s) => s[0])
              .join("")}
          </div>
          <div>
            <div className="text-sm font-medium">{selected.from}</div>
            <div className="text-xs text-neutral-500">{selected.role}</div>
            <div className="text-xs text-neutral-400">{selected.fromEmail}</div>
          </div>
        </div>
        <div className="mt-6 text-[14px] leading-relaxed text-neutral-800">
          <Markdown text={selected.body} />
        </div>
      </div>
    </div>
  );
}

function Item({
  icon,
  label,
  count,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1 rounded",
        active ? "bg-blue-500 text-white" : "hover:bg-black/5",
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && <span className="text-[11px] opacity-70">{count}</span>}
    </button>
  );
}
