import { LAB_CLIMA_CONTENT, PROJECT_STORY_CONTENT, SKILLS_CONTENT } from "@/lib/content";

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
          name: "Placeholder Labs — Design Lead",
          children: [
            {
              type: "file",
              name: "job.md",
              kind: "markdown",
              content: `# Placeholder Labs\n**Design Lead · 2022 — Present**\n\nLed a team of six across web, mobile, and internal tooling. Shipped a full design system, cut onboarding time in half, and helped raise a Series B.`,
            },
          ],
        },
        {
          type: "folder",
          name: "Foobar Inc — Senior Designer",
          children: [
            {
              type: "file",
              name: "job.md",
              kind: "markdown",
              content: `# Foobar Inc\n**Senior Designer · 2019 — 2022**\n\nRedesigned the flagship dashboard used by 200k+ users. Prototyped a real-time collab feature that became the top-requested launch of the year.`,
            },
          ],
        },
        {
          type: "folder",
          name: "Widget Co — Designer",
          children: [
            {
              type: "file",
              name: "job.md",
              kind: "markdown",
              content: `# Widget Co\n**Product Designer · 2016 — 2019**\n\nFirst design hire. Built brand, marketing site, and product from scratch.`,
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
          name: "field-notes.md",
          kind: "markdown",
          content: `# Field Notes\n\n- Ship the ugly version first.\n- Latency is a feeling, not a number.\n- If you can't explain it in one sentence, you don't know it yet.`,
        },
        {
          type: "file",
          name: "tinytype.md",
          kind: "markdown",
          content: `# Tinytype\nA minimalist writing app for the terminal. 2k users, no ads, no accounts.`,
        },
        {
          type: "file",
          name: "shelf.md",
          kind: "markdown",
          content: `# Shelf\nA personal reading tracker built in a weekend. Uses only local storage.`,
        },
        {
          type: "file",
          name: "coursework.md",
          kind: "markdown",
          content: `# Coursework\nSelected university projects: interactive typography study, generative brand system, and an accessibility audit for a public transit app.`,
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
