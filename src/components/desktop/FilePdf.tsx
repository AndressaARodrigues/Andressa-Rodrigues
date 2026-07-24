import { cn } from "@/lib/utils";

export function FilePdf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 52" className={cn(className)} aria-hidden="true">
      <path
        d="M6 2h22l10 10v36a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        fill="var(--file-fill)"
      />
      <path d="M28 2v10h10" fill="var(--file-fold)" />
      <text x="22" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e5484d">
        PDF
      </text>
    </svg>
  );
}
