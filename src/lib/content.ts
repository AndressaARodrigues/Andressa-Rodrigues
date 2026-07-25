export const PROJECT_STORY_CONTENT = `# About This Project

*This whole desktop didn't start as a grand plan. It started as a prompt.*

## Origin

While browsing the web, I found [this article](https://promptdrivendeveloper.com/p/build-a-macos-style-portfolio-website) proposing a single prompt to generate a macOS-style interactive portfolio.

Naturally, I had to test it. I threw it at a few different AI app builders just to see who could actually pull it off. Lovable was the one that actually built it — draggable windows, a working Terminal, the whole desktop metaphor and ✨WORKING✨.


## The Prompt That Started It All

Here it is, word for word, exactly what I typed in:

\`\`\`prompt
# Build a macOS inspired desktop portfolio website with placeholder content

Create a fully interactive portfolio website that simulates a macOS desktop environment in the browser. The site should feel like a real operating system where visitors explore the portfolio by opening apps, browsing folders and discovering hidden features.

## Core Features

### Desktop environment

- full-screen desktop with macOS style wallpaper

- top menu bar with logo (left), active app name (center), clock and system icons (right)

- bottom dock with app icons, magnification effect on hover, centered floating design

- draggable desktop icons with visual selection states

- double-click icons to open, single-click to select

### Window management

- draggable windows with macOS style traffic light buttons (red=close, yellow=minimize, green=maximize)

- click any window to bring it to front (z-index stacking)

- smooth animations for open/close/minimize (scale + fade transitions)

### File system & folder structure

Create a hierarchical file system with these folders and files:

- readme.md file (bio, photo, links)

- demo folder (work history folders -> job.md)

- projects folder (substack post sample)

- system folder (side projects)

- resume.pdf file

- trash bin

### Apps to build

1. Finder: file browser with sidebar navigation, grid/list view toggle, breadcrumbs, search functionality

2. Terminal: interactive command line with dark theme, command history (up/down arrows), monospace font, blinking cursor and these commands:

1. help - list all commands

2. about - opens readme

3. ls - list current directory contents

4. ls -a - show hidden files

5. cd [folder] - navigate folders

6. cat [file] - display file contents

7. clear - clear terminal

9. easter eggs (details below)

3. Email client: display testimonials/recommendations as inbox emails with sender, subject, preview.

4. PDF viewer: display resume with download button

5. Solitaire game: fully playable with timer, and scoring

### Easter eggs

- fun easter egg terminal commands like cowsay, fortune, matrix, coffee

- konami code easter egg (up up down down left right left right B A)

- keyboard shortcuts

- terminal secret commands and modes

- smooth micro-interactions throughout

- hidden files that appear with ls -a

### Design requirements

- monochrome or minimal color palette with subtle accents

- clean, modern interpretation of macOS aesthetic

- smooth animations and transitions everywhere

- responsive design that works on tablets (desktops primarily)

- icons for folders, files and apps.
\`\`\`

## Where It Got Tricky

The prompt alone gets you a genuinely working desktop. But it's a starting point, not a finish line. The second I wanted to add new apps and go deeper on the file system, staying inside the builder stopped making sense: partly the credit limits kicked in 😭😭😭. So I downloaded the project and kept building it locally from there. Generate first, then take it home and make it yours. 💡

## Then It Became Mine ❤️

A few of the things I added along the way:

- **A look of its own**: pink accents on folders, custom wallpapers, and styling that's basically a mood board of my own taste.
- **Content that actually says something**: every project living in one folder, a photos folder, and a browsing flow that doubles as a skills section if you poke around enough.
- **Apps and widgets I just wanted**: a music player with album art sitting right on the desktop, an iMessage-style contacts app, a live weather widget.
- **Little touches that make it feel alive**: light/dark mode, Spotlight search, a boot screen, a welcome sticky note, and system sounds.
- **Because everyone likes options**: settings for language, appearance, sound, and wallpaper.
`;

export const SKILLS_CONTENT = `# Skills

**Frontend**
Vue.js · React.js · Next.js · TypeScript · JavaScript


**Backend**
Node.js · Python · Flask · PHP · CodeIgniter


**APIs**
REST · GraphQL


**Dados**
MySQL · MongoDB · MariaDB


**Cloud & DevOps**
AWS · Docker · Kubernetes · CI/CD · Git


**IA & Automação**
LLM APIs · Prompt Engineering · AI-Assisted Development


**Qualidade & Arquitetura**
Testes (Jest, Playwright) · Code Review · System Design


**Práticas**
Scrum · Kanban`;

export const LAB_CLIMA_CONTENT = `
# Lab Clima ☀️

*Climate Monitoring Weather Station*

Rio Grande do Sul lived through the weight of **floods** up close — making it clear how urgent **climate literacy** is for communities.

At Colégio João XXIII, this is compounded by its location on **high ground in Porto Alegre**, exposed to heavy rain, lightning, and falling trees, affecting a community that already travels a long way to reach the classroom.

**Lab Clima** was created to change that: a **low-cost** system that collects and delivers local climate data, combining technology and prevention to bring **safety** and climate literacy to the school community — designed to be **replicable**, so any school can become a hub for monitoring and social transformation.

## The solution 💡

A real-time climate monitoring system with two goals:

- **Prevention**, giving the school community the information to prepare ahead of adverse weather conditions
- **Hands-on learning**, using real data collected on-site as a tool for teaching students about climate

I was one of the project's founders and led the team from start to finish.

## How it works ⚙️

A station built on **Raspberry Pi** continuously tracks weather conditions through:

- A **BME280** sensor (temperature, humidity, and pressure)
- A **BH1750** light sensor

This data feeds a **VAR (Vector Autoregression)** prediction model, which forecasts climate trends based on the collected history. The information is stored in a **MariaDB** database, served through a **Python/Flask** API, and delivered to the school community via a **React** interface.

## Stack

\`React\` · \`Python\` · \`Flask\` · \`Raspberry Pi\` · \`BME280\` · \`BH1750\` · \`VAR\` · \`MariaDB\`


*Private repository — project images coming soon.*`;
