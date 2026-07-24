import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// Simple Klondike Solitaire (draw 1). Move top card between piles by clicking source then destination.

type Suit = "♠" | "♥" | "♦" | "♣";
interface Card {
  suit: Suit;
  rank: number; // 1-13
  faceUp: boolean;
  id: string;
}

interface State {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles by suit order
  tableau: Card[][]; // 7 piles
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANK_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newDeck(): Card[] {
  const cards: Card[] = [];
  for (const s of SUITS) for (let r = 1; r <= 13; r++) cards.push({ suit: s, rank: r, faceUp: false, id: `${s}${r}` });
  return shuffle(cards);
}

function deal(): State {
  const deck = newDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let idx = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      const c = deck[idx++];
      tableau[j].push({ ...c, faceUp: j === i });
    }
  }
  return { stock: deck.slice(idx), waste: [], foundations: [[], [], [], []], tableau };
}

const isRed = (s: Suit) => s === "♥" || s === "♦";

export function Solitaire() {
  const [state, setState] = useState<State>(() => deal());
  const [selected, setSelected] = useState<{ from: string; index: number } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [won]);

  useEffect(() => {
    if (state.foundations.every((f) => f.length === 13)) setWon(true);
  }, [state]);

  const timeStr = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [seconds]);

  const reset = () => {
    setState(deal());
    setSelected(null);
    setSeconds(0);
    setScore(0);
    setWon(false);
  };

  const drawStock = () => {
    setState((s) => {
      if (s.stock.length === 0) {
        return { ...s, stock: s.waste.map((c) => ({ ...c, faceUp: false })).reverse(), waste: [] };
      }
      const [top, ...rest] = s.stock;
      return { ...s, stock: rest, waste: [...s.waste, { ...top, faceUp: true }] };
    });
    setSelected(null);
  };

  const canPlaceOnTableau = (moving: Card, target?: Card) => {
    if (!target) return moving.rank === 13;
    if (!target.faceUp) return false;
    return isRed(moving.suit) !== isRed(target.suit) && moving.rank === target.rank - 1;
  };
  const canPlaceOnFoundation = (moving: Card, pile: Card[]) => {
    if (pile.length === 0) return moving.rank === 1;
    const top = pile[pile.length - 1];
    return top.suit === moving.suit && moving.rank === top.rank + 1;
  };

  const tryMove = (from: string, index: number, to: string) => {
    setState((s) => {
      const next: State = {
        stock: [...s.stock],
        waste: [...s.waste],
        foundations: s.foundations.map((f) => [...f]),
        tableau: s.tableau.map((t) => [...t]),
      };
      // pick moving cards
      let moving: Card[] = [];
      const takeFrom = () => {
        if (from === "waste") { moving = [next.waste[next.waste.length - 1]]; next.waste.pop(); }
        else if (from.startsWith("t")) {
          const ti = parseInt(from.slice(1));
          moving = next.tableau[ti].slice(index);
          next.tableau[ti] = next.tableau[ti].slice(0, index);
        } else if (from.startsWith("f")) {
          const fi = parseInt(from.slice(1));
          moving = [next.foundations[fi][next.foundations[fi].length - 1]];
          next.foundations[fi].pop();
        }
      };
      const revertFrom = () => {
        if (from === "waste") next.waste.push(...moving);
        else if (from.startsWith("t")) { const ti = parseInt(from.slice(1)); next.tableau[ti].push(...moving); }
        else if (from.startsWith("f")) { const fi = parseInt(from.slice(1)); next.foundations[fi].push(...moving); }
      };
      takeFrom();
      if (!moving.length) return s;

      let ok = false;
      let scoreDelta = 0;
      if (to.startsWith("t")) {
        const ti = parseInt(to.slice(1));
        const target = next.tableau[ti][next.tableau[ti].length - 1];
        if (canPlaceOnTableau(moving[0], target)) {
          next.tableau[ti].push(...moving);
          ok = true;
          if (from === "waste") scoreDelta = 5;
        }
      } else if (to.startsWith("f")) {
        if (moving.length !== 1) { revertFrom(); return s; }
        const fi = parseInt(to.slice(1));
        if (canPlaceOnFoundation(moving[0], next.foundations[fi])) {
          next.foundations[fi].push(...moving);
          ok = true;
          scoreDelta = 10;
        }
      }
      if (!ok) { revertFrom(); return s; }
      // flip newly exposed tableau card
      if (from.startsWith("t")) {
        const ti = parseInt(from.slice(1));
        const top = next.tableau[ti][next.tableau[ti].length - 1];
        if (top && !top.faceUp) { top.faceUp = true; scoreDelta += 5; }
      }
      if (scoreDelta) setScore((sc) => sc + scoreDelta);
      return next;
    });
    setSelected(null);
  };

  const handleClick = (pile: string, index: number, card?: Card) => {
    if (!selected) {
      if (!card || !card.faceUp) return;
      setSelected({ from: pile, index });
    } else {
      if (selected.from === pile) { setSelected(null); return; }
      tryMove(selected.from, selected.index, pile);
    }
  };

  return (
    <div className="w-full h-full bg-emerald-800 text-white flex flex-col">
      <div className="h-9 bg-emerald-900/60 flex items-center gap-4 px-3 text-xs border-b border-black/20">
        <button onClick={reset} className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20">New Game</button>
        <span>Time: <span className="tabular-nums font-mono">{timeStr}</span></span>
        <span>Score: <span className="tabular-nums font-mono">{score}</span></span>
        <div className="flex-1" />
        <span className="opacity-70">Click a card, then click a destination.</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-2 mb-4">
          <div
            onClick={drawStock}
            className="w-14 h-20 rounded-md border border-white/30 bg-emerald-700 flex items-center justify-center cursor-pointer text-xs"
          >
            {state.stock.length ? "🂠" : "↻"}
          </div>
          <PileSlot onClick={() => handleClick("waste", state.waste.length - 1, state.waste[state.waste.length - 1])} selected={selected?.from === "waste"}>
            {state.waste.length > 0 && <CardView card={state.waste[state.waste.length - 1]} />}
          </PileSlot>
          <div className="flex-1" />
          {state.foundations.map((f, i) => (
            <PileSlot key={i} label={SUITS[i]} onClick={() => handleClick(`f${i}`, f.length - 1, f[f.length - 1])} selected={selected?.from === `f${i}`}>
              {f.length > 0 && <CardView card={f[f.length - 1]} />}
            </PileSlot>
          ))}
        </div>
        <div className="flex gap-2">
          {state.tableau.map((pile, ti) => (
            <div key={ti} className="flex-1 min-w-14">
              <PileSlot onClick={() => handleClick(`t${ti}`, pile.length, undefined)} selected={selected?.from === `t${ti}` && selected.index === pile.length}>
                {pile.length === 0 && <span className="opacity-40 text-xl">·</span>}
              </PileSlot>
              <div className="relative">
                {pile.map((c, ci) => (
                  <div
                    key={c.id}
                    className={cn(
                      "absolute left-0",
                      selected?.from === `t${ti}` && ci >= selected.index && "ring-2 ring-yellow-300 rounded-md",
                    )}
                    style={{ top: ci * 22 }}
                    onClick={(e) => { e.stopPropagation(); handleClick(`t${ti}`, ci, c); }}
                  >
                    <CardView card={c} />
                  </div>
                ))}
                <div style={{ height: pile.length * 22 + 80 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {won && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white text-neutral-900 rounded-xl p-6 text-center shadow-2xl">
            <div className="text-2xl font-bold">You win 🎉</div>
            <div className="mt-2 text-sm">Time {timeStr} · Score {score}</div>
            <button onClick={reset} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md">Play again</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PileSlot({ children, onClick, selected, label }: { children?: React.ReactNode; onClick?: () => void; selected?: boolean; label?: string }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-14 h-20 rounded-md border border-white/30 bg-emerald-700/60 flex items-center justify-center cursor-pointer relative",
        selected && "ring-2 ring-yellow-300",
      )}
    >
      {label && <span className="absolute opacity-30 text-lg">{label}</span>}
      {children}
    </div>
  );
}

function CardView({ card }: { card: Card }) {
  if (!card.faceUp) {
    return <div className="w-14 h-20 rounded-md bg-blue-900 border border-white/40 shadow" />;
  }
  const red = isRed(card.suit);
  return (
    <div className={cn("w-14 h-20 rounded-md bg-white border border-black/20 shadow flex flex-col p-1", red ? "text-red-600" : "text-neutral-900")}>
      <div className="text-xs font-semibold leading-none">{RANK_LABEL[card.rank]}</div>
      <div className="text-xs leading-none">{card.suit}</div>
      <div className="flex-1 flex items-center justify-center text-xl">{card.suit}</div>
    </div>
  );
}
