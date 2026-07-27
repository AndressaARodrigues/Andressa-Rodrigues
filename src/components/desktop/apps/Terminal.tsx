import { useEffect, useMemo, useRef, useState } from "react";
import { filesystem, findNodeByPath, type FSFolder } from "@/lib/filesystem";
import { useI18n } from "@/lib/i18n";
import { useWindows, type WindowState } from "../WindowManager";

interface Line {
  kind: "in" | "out" | "err" | "art";
  text: string;
}

const HELP = `Available commands:
  help              Show this message
  about             Open the readme
  ls [-a]           List directory contents (-a for hidden)
  cd <folder>       Change directory
  pwd               Print working directory
  cat <file>        Display file contents
  clear             Clear the terminal
  open <app>        Open an app (finder, mail, pdf, solitaire)
  whoami            Who you are
  date              Current date
  echo <text>       Print text
  cowsay <text>     A cow says something
  fortune           Random wisdom
  matrix            Enter the matrix (esc to exit)
  coffee            Brew a cup
  sudo              Do you feel lucky?`;

const FORTUNES = [
  "Ship the ugly version first.",
  "Constraints breed creativity.",
  "You cannot outrun your taste.",
  "The best interface is invisible.",
  "Latency is a feeling.",
  "Delete more than you write.",
];

export function Terminal({ window: w }: { window: WindowState }) {
  const { open } = useWindows();
  const { tl } = useI18n();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "portfolio-os v1.0.0 — type 'help' to get started" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const [matrix, setMatrix] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cwdNode = useMemo(() => {
    const n = findNodeByPath(cwd);
    return n && n.type === "folder" ? n : filesystem;
  }, [cwd]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, matrix]);

  useEffect(() => {
    if (!matrix) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMatrix(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [matrix]);

  const prompt = `andressa@portfolio ~${cwd.length ? "/" + cwd.join("/") : ""} $`;

  const run = (raw: string) => {
    const cmd = raw.trim();
    const newLines: Line[] = [{ kind: "in", text: `${prompt} ${cmd}` }];
    if (!cmd) {
      setLines((l) => [...l, ...newLines]);
      return;
    }
    const [name, ...args] = cmd.split(/\s+/);
    const out = (t: string) => newLines.push({ kind: "out", text: t });
    const err = (t: string) => newLines.push({ kind: "err", text: t });
    const art = (t: string) => newLines.push({ kind: "art", text: t });

    switch (name) {
      case "help":
        out(HELP);
        break;
      case "about":
        open("readme", { title: "readme.md", data: { path: ["readme.md"] } });
        out("Opening readme.md…");
        break;
      case "clear":
        setLines([]);
        return;
      case "pwd":
        out("/" + cwd.join("/"));
        break;
      case "whoami":
        out("guest — but feel free to poke around");
        break;
      case "date":
        out(new Date().toString());
        break;
      case "echo":
        out(args.join(" "));
        break;
      case "ls": {
        const showHidden = args.includes("-a");
        const items = (cwdNode as FSFolder).children
          .filter((c) => showHidden || !c.hidden)
          .map((c) => (c.type === "folder" ? c.name + "/" : c.name));
        out(items.join("   ") || "(empty)");
        break;
      }
      case "cd": {
        const target = args[0];
        if (!target || target === "~") {
          setCwd([]);
          break;
        }
        if (target === "..") {
          setCwd((p) => p.slice(0, -1));
          break;
        }
        const child = (cwdNode as FSFolder).children.find((c) => c.name === target);
        if (!child) err(`cd: no such directory: ${target}`);
        else if (child.type !== "folder") err(`cd: not a directory: ${target}`);
        else setCwd([...cwd, target]);
        break;
      }
      case "cat": {
        const target = args[0];
        const child = (cwdNode as FSFolder).children.find((c) => c.name === target);
        if (!child) err(`cat: no such file: ${target}`);
        else if (child.type !== "file") err(`cat: ${target}: Is a directory`);
        else out(child.content ? tl(child.content) : "(binary file)");
        break;
      }
      case "open": {
        const a = args[0];
        if (a === "finder") open("finder");
        else if (a === "mail") open("mail");
        else if (a === "pdf") open("pdf");
        else if (a === "solitaire") open("solitaire");
        else {
          err(`open: unknown app: ${a}`);
          break;
        }
        out(`Opening ${a}…`);
        break;
      }
      case "cowsay": {
        const msg = args.join(" ") || "moo";
        const bar = "-".repeat(msg.length + 2);
        art(
          ` ${bar}\n< ${msg} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`,
        );
        break;
      }
      case "fortune":
        out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
        break;
      case "matrix":
        out("Entering the matrix… press Esc to exit");
        setMatrix(true);
        break;
      case "coffee":
        art(
          "    ( (\n     ) )\n  ..........\n  |        |]\n  \\        /\n   `------'\n\nHere's your coffee ☕",
        );
        break;
      case "sudo":
        err("sudo: permission denied. Nice try.");
        break;
      case "rm":
        if (args.includes("-rf") && args.includes("/")) err("Absolutely not.");
        else err(`rm: cannot remove '${args.join(" ")}': read-only filesystem`);
        break;
      default:
        err(`command not found: ${name}. try 'help'`);
    }
    setLines((l) => [...l, ...newLines]);
  };

  const submit = () => {
    run(input);
    if (input.trim()) {
      setHistory((h) => [...h, input]);
    }
    setHistIdx(-1);
    setInput("");
  };

  return (
    <div
      className="w-full h-full bg-[#1a1a1a] text-[#e6e6e6] font-mono text-[13px] flex flex-col relative"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 leading-relaxed">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === "err"
                ? "text-red-400 whitespace-pre-wrap"
                : l.kind === "in"
                  ? "text-[#e6e6e6] whitespace-pre-wrap"
                  : l.kind === "art"
                    ? "text-green-300 whitespace-pre"
                    : "text-neutral-300 whitespace-pre-wrap"
            }
          >
            {l.text}
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="text-green-400">{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!history.length) return;
                const ni = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
                setHistIdx(ni);
                setInput(history[ni]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (histIdx < 0) return;
                const ni = histIdx + 1;
                if (ni >= history.length) {
                  setHistIdx(-1);
                  setInput("");
                } else {
                  setHistIdx(ni);
                  setInput(history[ni]);
                }
              }
            }}
            className="flex-1 bg-transparent outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
      {matrix && <MatrixOverlay />}
    </div>
  );
}

function MatrixOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    const cols = Math.floor(canvas.width / 14);
    const drops = new Array(cols).fill(1);
    const chars = "01ABCDEFxyz#$%&*+=<>?";
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-3 text-green-400 text-xs font-mono">esc to exit</div>
    </div>
  );
}
