import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { Send } from "lucide-react";

interface Bubble { id: string; from: "me" | "them"; text: string; state?: "sending" | "delivered"; }

export function Messages() {
  const { t } = useI18n();
  const { play } = useSounds();
  const [bubbles, setBubbles] = useState<Bubble[]>([
    { id: "hi", from: "them", text: "Hi! Leave a message and I'll get back to you 💌" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [bubbles, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = String(Date.now());
    setBubbles((b) => [...b, { id, from: "me", text, state: "sending" }]);
    setInput("");
    play("sent");
    setTimeout(() => {
      setBubbles((b) => b.map((x) => x.id === id ? { ...x, state: "delivered" } : x));
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        play("received");
        setBubbles((b) => [...b, { id: id+"r", from: "them", text: t("autoReply") }]);
      }, 1400);
    }, 700);
    // Fire an email compose in the background as a convenience
    try {
      const mailto = `mailto:andressa.rodrigues19@outlook.com?subject=Portfolio%20message&body=${encodeURIComponent(text)}`;
      window.open(mailto, "_blank", "noopener");
    } catch { /* noop */ }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="px-4 py-2 border-b border-black/10 dark:border-white/10 text-center text-sm font-medium">
        Andressa
        <div className="text-[11px] text-muted-foreground">andressa.rodrigues19@outlook.com</div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-2">
        {bubbles.map((b) => (
          <div key={b.id} className={b.from === "me" ? "flex justify-end" : "flex justify-start"}>
            <div className={
              "max-w-[75%] px-3 py-2 rounded-2xl text-sm " +
              (b.from === "me"
                ? "bg-blue-500 text-white rounded-br-sm animate-scale-in"
                : "bg-neutral-200 dark:bg-neutral-800 text-foreground rounded-bl-sm animate-scale-in")
            }>
              {b.text}
              {b.state && b.from === "me" && (
                <div className="text-[10px] mt-0.5 opacity-80 text-right">
                  {b.state === "sending" ? t("sending") : t("delivered")}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl px-3 py-2 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder={t("typeMessage")}
          className="flex-1 rounded-full px-4 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 outline-none border border-black/10 dark:border-white/10"
        />
        <button onClick={send} className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
