// Shared registry so floating desktop widgets (sticky note, weather, music)
// know about each other and can avoid overlapping.

export interface Rect { x: number; y: number; w: number; h: number }

interface Entry {
  getRect: () => Rect;
  setPos: (x: number, y: number) => void;
}

const registry = new Map<string, Entry>();

export function registerWidget(id: string, entry: Entry) {
  registry.set(id, entry);
  return () => { registry.delete(id); };
}

function overlaps(a: Rect, b: Rect): boolean {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

function clamp(x: number, min: number, max: number) { return Math.max(min, Math.min(max, x)); }

// Nudge `id` to a non-overlapping position relative to other registered widgets.
export function resolveCollisions(id: string) {
  const self = registry.get(id);
  if (!self) return;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  let rect = self.getRect();
  const others = () => Array.from(registry.entries()).filter(([k]) => k !== id).map(([, v]) => v.getRect());

  for (let iter = 0; iter < 8; iter++) {
    const hit = others().find((r) => overlaps(rect, r));
    if (!hit) break;
    // Compute minimal push along each axis to separate.
    const pushRight = hit.x + hit.w - rect.x + 8;
    const pushLeft = rect.x + rect.w - hit.x + 8;
    const pushDown = hit.y + hit.h - rect.y + 8;
    const pushUp = rect.y + rect.h - hit.y + 8;
    const minH = Math.min(pushRight, pushLeft);
    const minV = Math.min(pushDown, pushUp);
    if (minH < minV) {
      rect = { ...rect, x: pushRight < pushLeft ? rect.x + pushRight : rect.x - pushLeft };
    } else {
      rect = { ...rect, y: pushDown < pushUp ? rect.y + pushDown : rect.y - pushUp };
    }
    rect = {
      ...rect,
      x: clamp(rect.x, 8, vw - rect.w - 8),
      y: clamp(rect.y, 32, vh - rect.h - 8),
    };
  }
  self.setPos(rect.x, rect.y);
}
