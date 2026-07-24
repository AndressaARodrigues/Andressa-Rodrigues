import { cn } from "@/lib/utils";

export function PinkFolder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 50" className={cn(className)} aria-hidden="true">
      <path
        d="M4 10a4 4 0 0 1 4-4h14l4 5h30a4 4 0 0 1 4 4v27a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
        fill="var(--folder-fill)"
      />
      <path
        d="M4 16a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
        fill="var(--folder-front)"
      />
    </svg>
  );
}
