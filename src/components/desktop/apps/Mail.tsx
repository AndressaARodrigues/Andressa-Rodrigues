import { useState } from "react";
import { Star, Inbox, Send, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  starred?: boolean;
}

const EMAILS: Email[] = [
  {
    id: "1",
    from: "Jamie Lin",
    fromEmail: "jamie@placeholder-labs.com",
    subject: "Recommendation",
    preview: "Working with Alex was one of the highlights of my career...",
    body: `Alex is that rare designer who thinks like an engineer and ships like a founder. In two years together they rebuilt our entire product surface without ever losing sight of the people using it.\n\nHire them yesterday.\n\n— Jamie, VP Product`,
    time: "9:41 AM",
    starred: true,
  },
  {
    id: "2",
    from: "Priya Nair",
    fromEmail: "priya@foobar.io",
    subject: "Testimonial you asked for",
    preview: "You told me to keep it short, so: Alex is the calmest, sharpest...",
    body: `You told me to keep it short, so: Alex is the calmest, sharpest designer I have ever worked with. They ship. They listen. They mentor. Anyone would be lucky to have them.\n\n— Priya, Head of Design`,
    time: "Yesterday",
  },
  {
    id: "3",
    from: "Marcus Wu",
    fromEmail: "marcus@widget.co",
    subject: "A note for whoever hires you next",
    preview: "Alex was our first design hire and set the bar we still measure against...",
    body: `Alex was our first design hire and set the bar we still measure against. Their instinct for scope was uncanny — they knew what mattered before the rest of us did.\n\nMarcus\nFounder, Widget Co`,
    time: "Tuesday",
    starred: true,
  },
  {
    id: "4",
    from: "Sam Ortega",
    fromEmail: "sam@indie.dev",
    subject: "Re: side project collab",
    preview: "That prototype you sent over the weekend blew my mind...",
    body: `That prototype you sent over the weekend blew my mind. When can we ship it?\n\nSam`,
    time: "Mon",
  },
];

export function MailApp() {
  const [selected, setSelected] = useState<Email>(EMAILS[0]);
  return (
    <div className="w-full h-full flex text-sm">
      <aside className="w-40 border-r border-black/10 bg-neutral-50/80 p-2 text-xs flex flex-col gap-1">
        <Item icon={<Inbox className="w-3.5 h-3.5" />} label="Inbox" count={EMAILS.length} active />
        <Item icon={<Star className="w-3.5 h-3.5" />} label="Starred" />
        <Item icon={<Send className="w-3.5 h-3.5" />} label="Sent" />
        <Item icon={<Archive className="w-3.5 h-3.5" />} label="Archive" />
        <Item icon={<Trash2 className="w-3.5 h-3.5" />} label="Trash" />
      </aside>
      <div className="w-64 border-r border-black/10 overflow-auto">
        {EMAILS.map((e) => (
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
              <span className={cn("text-[11px] opacity-70")}>{e.time}</span>
            </div>
            <div className="text-xs truncate">{e.subject}</div>
            <div className={cn("text-[11px] truncate opacity-70")}>{e.preview}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="text-xs text-neutral-500">{selected.time}</div>
        <h1 className="text-2xl font-semibold mt-1">{selected.subject}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center text-xs font-medium">
            {selected.from.split(" ").map((s) => s[0]).join("")}
          </div>
          <div>
            <div className="text-sm font-medium">{selected.from}</div>
            <div className="text-xs text-neutral-500">{selected.fromEmail}</div>
          </div>
        </div>
        <div className="mt-6 whitespace-pre-wrap text-[14px] leading-relaxed text-neutral-800">
          {selected.body}
        </div>
      </div>
    </div>
  );
}

function Item({ icon, label, count, active }: { icon: React.ReactNode; label: string; count?: number; active?: boolean }) {
  return (
    <button className={cn("w-full flex items-center gap-2 px-2 py-1 rounded", active ? "bg-blue-500 text-white" : "hover:bg-black/5")}>
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && <span className="text-[11px] opacity-70">{count}</span>}
    </button>
  );
}
