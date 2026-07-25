import { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { Send, Mail } from "lucide-react";

interface Bubble {
  id: string;
  from: "me" | "them";
  text: string;
  state?: "sending" | "delivered";
}

const REPLY_DELAY_MS = 700;
const TYPING_DELAY_MS = 1400;

export function Messages() {
  const { t } = useI18n();
  const { play } = useSounds();
  const [bubbles, setBubbles] = useState<Bubble[]>([
    { id: "hi", from: "them", text: t("messagesIntro") },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastSentText, setLastSentText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setBubbles((b) =>
      b.map((bubble) => (bubble.id === "hi" ? { ...bubble, text: t("messagesIntro") } : bubble)),
    );
  }, [t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, typing]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeouts.current.push(id);
    return id;
  }, []);

  const simulateReply = useCallback(
    (messageId: string) => {
      schedule(() => {
        setBubbles((b) => b.map((x) => (x.id === messageId ? { ...x, state: "delivered" } : x)));
        setTyping(true);
        schedule(() => {
          setTyping(false);
          play("received");
          setBubbles((b) => [...b, { id: messageId + "-r", from: "them", text: t("autoReply") }]);
        }, TYPING_DELAY_MS);
      }, REPLY_DELAY_MS);
    },
    [schedule, play, t],
  );

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

    setBubbles((b) => [...b, { id, from: "me", text, state: "sending" }]);
    setInput("");
    setLastSentText(text);
    play("sent");
    simulateReply(id);
  };

  const sendByEmail = () => {
    const text = lastSentText.trim();
    if (!text) return;
    const mailto = `mailto:andressa.rodrigues19@outlook.com?subject=Portfolio%20message&body=${encodeURIComponent(
      text,
    )}`;
    window.open(mailto, "_blank", "noopener");
  };

  return (
    <div className="w-full h-full flex flex-col bg-linear-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="px-4 py-2 border-b border-black/10 dark:border-white/10 text-center text-sm font-medium">
        Andressa
        <div className="text-[11px] text-muted-foreground">andressa.rodrigues19@outlook.com</div>
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={t("typeMessage")}
        className="flex-1 overflow-auto p-4 space-y-2"
      >
        {bubbles.map((b) => (
          <div key={b.id} className={b.from === "me" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[75%] px-3 py-2 rounded-2xl text-sm " +
                (b.from === "me"
                  ? "bg-blue-500 text-white rounded-br-sm animate-scale-in"
                  : "bg-neutral-200 dark:bg-neutral-800 text-foreground rounded-bl-sm animate-scale-in")
              }
            >
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
          <div className="flex justify-start" aria-label={t("typing") ?? "..."}>
            <div className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl px-3 py-2 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {lastSentText && (
        <div className="px-3 pb-1 flex justify-end">
          <button
            onClick={sendByEmail}
            className="text-[11px] flex items-center gap-1 text-blue-500 hover:text-blue-600 px-2 py-1"
          >
            <Mail className="w-3 h-3" />
            {t("sendByEmail")}
          </button>
        </div>
      )}

      <div className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={t("typeMessage")}
          aria-label={t("typeMessage")}
          disabled={typing}
          className="flex-1 rounded-full px-4 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 outline-none border border-black/10 dark:border-white/10 disabled:opacity-60"
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          aria-label={t("send") ?? "Send"}
          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
