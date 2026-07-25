import {
  LAB_CLIMA_CONTENT,
  PIPELINE_EMENDAS_PIX_CONTENT,
  PROJECT_STORY_CONTENT,
  SKILLS_CONTENT,
  TUTOR_METODO_CIENTIFICO_CONTENT,
  NELOGICA_JOB_CONTENT,
  COMPASS_UOL_JOB_CONTENT,
  UNIPAMPA_JOB_CONTENT,
} from "@/lib/content";

// Virtual filesystem for the desktop portfolio
export type FSNode = FSFolder | FSFile;

export interface FSFolder {
  type: "folder";
  name: string;
  hidden?: boolean;
  children: FSNode[];
}

export interface FSFile {
  type: "file";
  name: string;
  hidden?: boolean;
  kind: "markdown" | "pdf" | "text" | "image";
  content?: string;
  src?: string; // for images
  caption?: string;
}

export interface Picture {
  id: string;
  src: string;
  caption: string;
}

export const PICTURES: Picture[] = [
  {
    id: "p1",
    src: "https://picsum.photos/seed/andressa-work-1/900/1200",
    caption: "Design sprint at the studio",
  },
  {
    id: "p2",
    src: "https://picsum.photos/seed/andressa-uni-1/900/1200",
    caption: "Graduation day, UFRGS",
  },
  {
    id: "p3",
    src: "https://picsum.photos/seed/andressa-event-1/1200/900",
    caption: "Speaking at UX Porto Alegre",
  },
  {
    id: "p4",
    src: "https://picsum.photos/seed/andressa-work-2/1200/900",
    caption: "Team offsite, coastal Brazil",
  },
  {
    id: "p5",
    src: "https://picsum.photos/seed/andressa-uni-2/900/1200",
    caption: "Late nights at the lab",
  },
  {
    id: "p6",
    src: "https://picsum.photos/seed/andressa-event-2/1200/900",
    caption: "Meetup dinner with the community",
  },
];

export const filesystem: FSFolder = {
  type: "folder",
  name: "~",
  children: [
    {
      type: "file",
      name: "readme.md",
      kind: "markdown",
    },
    {
      type: "file",
      name: "resume.pdf",
      kind: "pdf",
    },
    {
      type: "folder",
      name: "demo",
      children: [
        {
          type: "folder",
          name: "Nelogica — Software Engineer",
          children: [
            {
              type: "file",
              name: "job.md",
              kind: "markdown",
              content: NELOGICA_JOB_CONTENT,
            },
          ],
        },
        {
          type: "folder",
          name: "Compass Uol — Front-end Developer",
          children: [
            {
              type: "file",
              name: "job.md",
              kind: "markdown",
              content: COMPASS_UOL_JOB_CONTENT,
            },
          ],
        },
        {
          type: "folder",
          name: "Universidade Federal do Pampa — Full Stack Developer Intern",
          children: [
            {
              type: "file",
              name: "job.md",
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
      children: [
        {
          type: "file",
          name: "lab-clima.md",
          kind: "markdown",
          content: LAB_CLIMA_CONTENT,
        },
        {
          type: "file",
          name: "pipeline-emendas-pix.md",
          kind: "markdown",
          content: PIPELINE_EMENDAS_PIX_CONTENT,
        },
        {
          type: "file",
          name: "tutor-scientific-method.md",
          kind: "markdown",
          content: TUTOR_METODO_CIENTIFICO_CONTENT,
        },
        {
          type: "file",
          name: "about-this-project.md",
          kind: "markdown",
          content: PROJECT_STORY_CONTENT,
        },
        {
          type: "file",
          name: ".secrets",
          kind: "text",
          hidden: true,
          content: `You found the hidden file. Try 'matrix' in the Terminal. 🕶`,
        },
      ],
    },
    {
      type: "folder",
      name: "adventures",
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
