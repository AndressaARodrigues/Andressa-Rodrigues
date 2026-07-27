import type { Loc } from "@/lib/content";
import {
  LAB_CLIMA_CONTENT,
  PIPELINE_EMENDAS_PIX_CONTENT,
  PROJECT_STORY_CONTENT,
  SKILLS_CONTENT,
  TUTOR_METODO_CIENTIFICO_CONTENT,
  NELOGICA_JOB_CONTENT,
  COMPASS_UOL_JOB_CONTENT,
  UNIPAMPA_JOB_CONTENT,
  SECRETS_CONTENT,
  README_CONTENT,
} from "@/lib/content";
import university from "@/assets/pictures/unipampa.jpg";
import degree from "@/assets/pictures/degree.jpg";
import coffee from "@/assets/pictures/coffee-in-beach.jpg";
import sunrise from "@/assets/pictures/sunrise.jpg";
import ravena from "@/assets/pictures/ravena.jpg";
import batman from "@/assets/pictures/batman.jpg";
import eres from "@/assets/pictures/unipampa-in-eres.jpg";
import work from "@/assets/pictures/work.jpg";
import tcc from "@/assets/pictures/tcc.jpg";
import me from "@/assets/pictures/me.jpg";
import ppges from "@/assets/pictures/ppges.jpg";

export type Lang = "en" | "pt-BR";

/** Resolve a localized string bundle. */
export function loc(v: Loc | undefined, lang: Lang): string {
  if (!v) return "";
  return v[lang] ?? v.en;
}

// Virtual filesystem for the desktop portfolio
export type FSNode = FSFolder | FSFile;

export interface FSFolder {
  type: "folder";
  /** Stable identifier used for paths — never translated. */
  name: string;
  /** Localized display name. */
  label?: Loc;
  hidden?: boolean;
  children: FSNode[];
}

export interface FSFile {
  type: "file";
  name: string;
  label?: Loc;
  hidden?: boolean;
  kind: "markdown" | "pdf" | "text" | "image";
  content?: Loc;
  src?: string; // for images
  caption?: Loc;
}

export interface Picture {
  id: string;
  src: string;
  caption: Loc;
}

export const PICTURES: Picture[] = [
  {
    id: "p1",
    src: university,
    caption: {
      en: "Universidade Federal do Pampa, Campus Alegrete",
      "pt-BR": "Universidade Federal do Pampa, Campus Alegrete",
    },
  },
  {
    id: "p2",
    src: degree,
    caption: { en: "Graduation day, UNIPAMPA", "pt-BR": "Formatura, UNIPAMPA" },
  },
  {
    id: "p3",
    src: coffee,
    caption: { en: "Morning coffee at the beach", "pt-BR": "Café da manhã na praia" },
  },
  {
    id: "p4",
    src: tcc,
    caption: { en: "", "pt-BR": "" },
  },
  {
    id: "p5",
    src: sunrise,
    caption: { en: "", "pt-BR": "" },
  },
  {
    id: "p6",
    src: ravena,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
  {
    id: "p7",
    src: batman,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
  {
    id: "p8",
    src: eres,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
  {
    id: "p9",
    src: work,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
  {
    id: "p10",
    src: me,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
  {
    id: "p11",
    src: ppges,
    caption: {
      en: "",
      "pt-BR": "",
    },
  },
];

const JOB_FILE_LABEL: Loc = { en: "job.md", "pt-BR": "trabalho.md" };

export const filesystem: FSFolder = {
  type: "folder",
  name: "~",
  label: { en: "Home", "pt-BR": "Início" },
  children: [
    {
      type: "file",
      name: "readme.md",
      label: { en: "readme.md", "pt-BR": "leiame.md" },
      kind: "markdown",
      content: README_CONTENT,
    },
    {
      type: "file",
      name: "resume.pdf",
      label: { en: "resume.pdf", "pt-BR": "curriculo.pdf" },
      kind: "pdf",
    },
    {
      type: "folder",
      name: "demo",
      label: { en: "Experience", "pt-BR": "Experiência" },
      children: [
        {
          type: "folder",
          name: "Nelogica — Software Engineer",
          label: {
            en: "Nelogica — Software Engineer",
            "pt-BR": "Nelogica — Engenheira de Software",
          },
          children: [
            {
              type: "file",
              name: "job.md",
              label: JOB_FILE_LABEL,
              kind: "markdown",
              content: NELOGICA_JOB_CONTENT,
            },
          ],
        },
        {
          type: "folder",
          name: "Compass Uol — Front-end Developer",
          label: {
            en: "Compass Uol — Front-end Developer",
            "pt-BR": "Compass Uol — Desenvolvedora Front-end",
          },
          children: [
            {
              type: "file",
              name: "job.md",
              label: JOB_FILE_LABEL,
              kind: "markdown",
              content: COMPASS_UOL_JOB_CONTENT,
            },
          ],
        },
        {
          type: "folder",
          name: "Universidade Federal do Pampa — Full Stack Developer Intern",
          label: {
            en: "Universidade Federal do Pampa — Full Stack Developer Intern",
            "pt-BR": "Universidade Federal do Pampa — Estagiária de Desenvolvimento Full Stack",
          },
          children: [
            {
              type: "file",
              name: "job.md",
              label: JOB_FILE_LABEL,
              kind: "markdown",
              content: UNIPAMPA_JOB_CONTENT,
            },
          ],
        },
      ],
    },
    {
      type: "folder",
      name: "projects",
      label: { en: "Projects", "pt-BR": "Projetos" },
      children: [
        {
          type: "file",
          name: "lab-clima.md",
          label: { en: "lab-clima.md", "pt-BR": "lab-clima.md" },
          kind: "markdown",
          content: LAB_CLIMA_CONTENT,
        },
        {
          type: "file",
          name: "pipeline-emendas-pix.md",
          label: { en: "pipeline-emendas-pix.md", "pt-BR": "pipeline-emendas-pix.md" },
          kind: "markdown",
          content: PIPELINE_EMENDAS_PIX_CONTENT,
        },
        {
          type: "file",
          name: "tutor-scientific-method.md",
          label: { en: "tutor-scientific-method.md", "pt-BR": "tutor-metodo-cientifico.md" },
          kind: "markdown",
          content: TUTOR_METODO_CIENTIFICO_CONTENT,
        },
        {
          type: "file",
          name: "about-this-project.md",
          label: { en: "about-this-project.md", "pt-BR": "sobre-este-projeto.md" },
          kind: "markdown",
          content: PROJECT_STORY_CONTENT,
        },
        {
          type: "file",
          name: ".secrets",
          label: { en: ".secrets", "pt-BR": ".segredos" },
          kind: "text",
          hidden: true,
          content: SECRETS_CONTENT,
        },
      ],
    },
    {
      type: "folder",
      name: "adventures",
      label: { en: "Adventures", "pt-BR": "Aventuras" },
      hidden: true,
      children: PICTURES.map((p) => ({
        type: "file" as const,
        name: `${p.id}.jpg`,
        kind: "image" as const,
        src: p.src,
        caption: p.caption,
      })),
    },
    {
      type: "file",
      name: "skills.md",
      label: { en: "skills.md", "pt-BR": "habilidades.md" },
      kind: "markdown",
      content: SKILLS_CONTENT,
    },
  ],
};

export function findNodeByPath(path: string[]): FSNode | null {
  let node: FSNode = filesystem;
  for (const seg of path) {
    if (node.type !== "folder") return null;
    const next: FSNode | undefined = node.children.find((c) => c.name === seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

/** Localized display name for a node (falls back to the stable name). */
export function nodeLabel(node: FSNode | null | undefined, lang: Lang): string {
  if (!node) return "";
  return node.label ? loc(node.label, lang) : node.name;
}

/** Localized display name for a path, resolving each segment. */
export function labelForPath(path: string[], lang: Lang): string[] {
  const out: string[] = [];
  let node: FSNode = filesystem;
  for (const seg of path) {
    if (node.type !== "folder") break;
    const next: FSNode | undefined = node.children.find((c) => c.name === seg);
    if (!next) {
      out.push(seg);
      break;
    }
    out.push(nodeLabel(next, lang));
    node = next;
  }
  return out;
}

/**
 * Resolve a user-typed name (in either language) to the stable node name
 * within a folder. Used by the Terminal so `cd`/`cat` work in both languages.
 */
export function resolveChild(folder: FSFolder, typed: string): FSNode | null {
  const t = typed.toLowerCase();
  return (
    folder.children.find((c) => c.name.toLowerCase() === t) ??
    folder.children.find(
      (c) => c.label && (c.label.en.toLowerCase() === t || c.label["pt-BR"].toLowerCase() === t),
    ) ??
    null
  );
}
