import { useState } from "react";
import { Download, Printer } from "lucide-react";

export function PdfViewer() {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="w-full h-full flex flex-col bg-neutral-200">
      <div className="h-9 border-b border-black/10 bg-neutral-100 flex items-center gap-2 px-3 text-xs">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="px-2 py-0.5 rounded border border-black/10 bg-white"
        >
          −
        </button>
        <span className="tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="px-2 py-0.5 rounded border border-black/10 bg-white"
        >
          +
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1 px-2 py-0.5 rounded border border-black/10 bg-white">
          <Printer className="w-3 h-3" /> Print
        </button>
        <button className="flex items-center gap-1 px-2 py-0.5 rounded border border-black/10 bg-white">
          <Download className="w-3 h-3" /> Download
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          className="bg-white shadow-xl border border-black/10 origin-top"
          style={{ transform: `scale(${zoom})`, width: 612, minHeight: 792 }}
        >
          <div className="px-12 py-10 text-neutral-800">
            <h1 className="text-3xl font-bold">Alex Placeholder</h1>
            <p className="text-sm text-neutral-500 mt-1">
              hello@placeholder.dev · placeholder.dev · San Francisco, CA
            </p>
            <hr className="my-4 border-neutral-200" />
            <h2 className="text-lg font-semibold mt-4">Experience</h2>
            <div className="mt-2 space-y-3 text-sm">
              <Job title="Design Lead" company="Placeholder Labs" years="2022 — Present" bullets={[
                "Led a team of six across web, mobile, and internal tooling.",
                "Shipped the first company-wide design system.",
                "Cut new-hire onboarding time in half.",
              ]} />
              <Job title="Senior Designer" company="Foobar Inc" years="2019 — 2022" bullets={[
                "Redesigned the flagship dashboard for 200k+ users.",
                "Prototyped and shipped a real-time collab feature.",
              ]} />
              <Job title="Product Designer" company="Widget Co" years="2016 — 2019" bullets={[
                "First design hire. Built brand, marketing site, product.",
              ]} />
            </div>
            <h2 className="text-lg font-semibold mt-6">Education</h2>
            <p className="text-sm mt-1">B.A. Design, Placeholder University · 2012 — 2016</p>
            <h2 className="text-lg font-semibold mt-6">Selected Talks</h2>
            <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
              <li>Config 2024 — "Designing for latency"</li>
              <li>UX London 2023 — "The last mile of onboarding"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Job({ title, company, years, bullets }: { title: string; company: string; years: string; bullets: string[] }) {
  return (
    <div>
      <div className="flex justify-between font-medium">
        <span>{title} · {company}</span>
        <span className="text-neutral-500">{years}</span>
      </div>
      <ul className="list-disc pl-5 mt-1 text-neutral-700">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}
