import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import {
  RESUME_ABOUT,
  RESUME_JOBS,
  RESUME_EDUCATION,
  RESUME_SKILLS,
  type ResumeJob,
} from "@/lib/content";
import jsPDF from "jspdf";

const PAGE_HEIGHT = 792;
const BOTTOM_MARGIN = 56;

function generateResume(
  lang: Lang,
  t: (k: "aboutTitle" | "demo" | "educationTitle" | "skills") => string,
) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const left = 56;
  let y = 72;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage();
      y = 72;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Andressa Rodrigues", left, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text("andressa.rodrigues19@outlook.com · Porto Alegre, BR", left, y);
  doc.setTextColor(0);
  y += 24;
  doc.setDrawColor(220);
  doc.line(left, y, 556, y);
  y += 22;

  const section = (title: string) => {
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, left, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
  };

  const line = (text: string, indent = 0) => {
    const wrapped = doc.splitTextToSize(text, 500 - indent);
    const height = 14 * wrapped.length;
    ensureSpace(height);
    doc.text(wrapped, left + indent, y);
    y += height;
  };

  section(t("aboutTitle"));
  line(RESUME_ABOUT[lang]);
  y += 12;

  section(t("demo"));
  RESUME_JOBS.forEach((job: ResumeJob, i) => {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    line(`${job.title[lang]} · ${job.company}   (${job.years[lang]})`);
    doc.setFont("helvetica", "normal");
    job.bullets.forEach((b) => line(`• ${b[lang]}`, 10));
    if (i < RESUME_JOBS.length - 1) y += 6;
  });

  y += 12;

  section(t("educationTitle"));
  RESUME_EDUCATION.forEach((edu, i) => {
    doc.setFont("helvetica", "bold");
    line(edu.course[lang]);
    doc.setFont("helvetica", "normal");
    line(`${edu.institution} · ${edu.years[lang]}`);
    if (i < RESUME_EDUCATION.length - 1) y += 4;
  });

  y += 12;

  section(t("skills"));
  RESUME_SKILLS.forEach((s) => line(`${s.label[lang]}: ${s.value}`));

  doc.save(lang === "pt-BR" ? "andressa-rodrigues-curriculo.pdf" : "andressa-rodrigues-resume.pdf");
}

export function PdfViewer() {
  const [zoom, setZoom] = useState(1);
  const { t, lang } = useI18n();

  return (
    <div className="w-full h-full flex flex-col bg-neutral-200 dark:bg-neutral-800">
      <div className="h-9 border-b border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 flex items-center gap-2 px-3 text-xs text-neutral-800 dark:text-neutral-100">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="px-2 py-0.5 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800"
        >
          −
        </button>
        <span className="tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="px-2 py-0.5 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800"
        >
          +
        </button>
        <div className="flex-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1 px-2 py-0.5 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800"
        >
          <Printer className="w-3 h-3" /> {t("print")}
        </button>
        <button
          onClick={() => generateResume(lang, t)}
          className="flex items-center gap-1 px-2 py-0.5 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800"
        >
          <Download className="w-3 h-3" /> {t("download")}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div
          className="bg-white shadow-xl border border-black/10 origin-top mx-auto"
          style={{ transform: `scale(${zoom})`, width: 612, minHeight: 792 }}
        >
          <div className="px-12 pt-10 pb-24 text-neutral-800">
            <h1 className="text-3xl font-bold">Andressa Rodrigues</h1>
            <p className="text-sm text-neutral-500 mt-1">
              andressa.rodrigues19@outlook.com · Porto Alegre, BR
            </p>
            <hr className="my-4 border-neutral-200" />

            <h2 className="text-lg font-semibold mt-4">{t("aboutTitle")}</h2>
            <p className="text-sm mt-2 text-neutral-700">{RESUME_ABOUT[lang]}</p>

            <h2 className="text-lg font-semibold mt-6">{t("demo")}</h2>
            <div className="mt-2 space-y-3 text-sm">
              {RESUME_JOBS.map((job) => (
                <Job
                  key={job.company}
                  title={job.title[lang]}
                  company={job.company}
                  years={job.years[lang]}
                  bullets={job.bullets.map((b) => b[lang])}
                />
              ))}
            </div>

            <h2 className="text-lg font-semibold mt-6">{t("educationTitle")}</h2>
            <div className="mt-2 space-y-2 text-sm">
              {RESUME_EDUCATION.map((edu, i) => (
                <div key={i}>
                  <div className="font-medium">{edu.course[lang]}</div>
                  <div className="text-neutral-500">
                    {edu.institution} · {edu.years[lang]}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold mt-6">{t("skills")}</h2>
            <ul className="text-sm mt-1 space-y-0.5">
              {RESUME_SKILLS.map((s) => (
                <li key={s.value}>
                  <strong>{s.label[lang]}:</strong> {s.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Job({
  title,
  company,
  years,
  bullets,
}: {
  title: string;
  company: string;
  years: string;
  bullets: string[];
}) {
  return (
    <div>
      <div className="flex justify-between font-medium">
        <span>
          {title} · {company}
        </span>
        <span className="text-neutral-500">{years}</span>
      </div>
      <ul className="list-disc pl-5 mt-1 text-neutral-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
