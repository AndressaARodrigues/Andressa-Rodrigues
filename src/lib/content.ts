export const SKILLS_LINES = [
  "Languages:       JavaScript · TypeScript · Python · PHP",
  "Frontend:        Vue.js · React.js · Next.js · Design Systems",
  "Backend:         Node.js · Flask · CodeIgniter · REST · GraphQL · SOAP",
  "Data:            MySQL · MongoDB · MariaDB · Medallion architecture (Bronze/Silver/Gold)",
  "AI / Research:   LangGraph · Chainlit · Ollama · Smart Systems",
  "IoT:             Raspberry Pi · sensors (BME280, luminosity)",
  "Cloud / DevOps:  AWS · Docker · Git · Vite/Webpack",
  "Practices:       Scrum · Kanban · Code Review · Testing",
];

export const SKILLS_MARKDOWN = `# Skills

\`\`\`
${SKILLS_LINES.join("\n")}
\`\`\`
`;

export const PROJECT_STORY_MARKDOWN = `# About this project

This portfolio started as a prototype built in Lovable.

## The starting point
The initial inspiration came from this article:
https://promptdrivendeveloper.com/p/build-a-macos-style-portfolio-website

The initial prompt asked for an interactive portfolio that simulates a
macOS desktop environment in the browser, with a dock, draggable windows
with traffic-light buttons, a navigable file system, Finder, an interactive
Terminal, an email client, a PDF viewer, a Solitaire game, easter eggs and
a minimal aesthetic.

## How it evolved
From that prototype, the portfolio grew a personality of its own. Some of
the main additions along the way:

- Menu bar system name changed to "Andressa's Portfolio".
- Pink folder icons as a visual accent, later refined for good contrast in
  both themes.
- Removed the "system" folder: all projects now live together under
  "projects".
- A personal photos folder ("Adventures"), hidden and discoverable through
  Finder or via \`ls -a\`.
- A music player visible on the desktop, with a personal playlist, album
  art and real audio.
- An iMessage-style Messages app for contact, with send/receive sounds.
- A weather widget with live data for Porto Alegre and a nod to the weather
  station project I built for a school.
- Light/dark mode, Spotlight (\`⌘+Space\`), a boot screen, a welcome sticky
  note and tasteful macOS-style system sounds.
- Settings for language (PT-BR / EN), appearance, sound and wallpaper.
- Final personality touches: scenic wallpapers, a skills section, this
  project story, and a cat chasing a ball of yarn.

## From there to here
The prototype was downloaded from Lovable and development continued directly
on the React code, where every detail was hand-tuned to make it my own.
`;

export const PROJECT_STORY_TEXT = `About this project

This portfolio started as a prototype built in Lovable.

The initial inspiration came from:
https://promptdrivendeveloper.com/p/build-a-macos-style-portfolio-website

It evolved into a macOS-style desktop portfolio with a dock, draggable
windows, a navigable file system, Finder, Terminal, an email client, a PDF
viewer, Solitaire, hidden easter eggs, light/dark mode, Spotlight, a boot
screen, a welcome sticky note, desktop widgets, scenic wallpapers, a skills
section, this project story, and a cat chasing a ball of yarn.
`;

