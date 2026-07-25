export interface Loc {
  en: string;
  "pt-BR": string;
}

export const SKILLS_CONTENT: Loc = {
  en: `# Skills

**Frontend**
Vue.js · React.js · Next.js · TypeScript · JavaScript


**Backend**
Node.js · Python · Flask · PHP · CodeIgniter


**APIs**
REST · GraphQL


**Data**
MySQL · MongoDB · MariaDB


**Cloud & DevOps**
AWS · Docker · Kubernetes · CI/CD · Git


**AI & Automation**
LLM APIs · Prompt Engineering · AI-Assisted Development


**Quality & Architecture**
Testing (Jest, Playwright) · Code Review · System Design


**Practices**
Scrum · Kanban`,
  "pt-BR": `# Habilidades

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
APIs de LLM · Engenharia de Prompt · Desenvolvimento Assistido por IA


**Qualidade & Arquitetura**
Testes (Jest, Playwright) · Code Review · Design de Sistemas


**Práticas**
Scrum · Kanban`,
};

export const NELOGICA_JOB_CONTENT: Loc = {
  en: `# Nelogica
**Software Engineer · 2024 — Present**

Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions.`,
  "pt-BR": `# Nelogica
**Engenheira de Software · 2024 — Atual**

Desenvolvimento e manutenção de aplicações web com tecnologias modernas. Colaboração com times multidisciplinares para entregar soluções de software de alta qualidade.`,
};

export const COMPASS_UOL_JOB_CONTENT: Loc = {
  en: `# Compass Uol
**Front-end Developer · 2023**

Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions.`,
  "pt-BR": `# Compass Uol
**Desenvolvedora Front-end · 2023**

Desenvolvimento e manutenção de aplicações web com tecnologias modernas. Colaboração com times multidisciplinares para entregar soluções de software de alta qualidade.`,
};

export const UNIPAMPA_JOB_CONTENT: Loc = {
  en: `# Universidade Federal do Pampa
**Fullstack Developer Intern · 2022 — 2023**

Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions.`,
  "pt-BR": `# Universidade Federal do Pampa
**Estagiária de Desenvolvimento Fullstack · 2022 — 2023**

Desenvolvimento e manutenção de aplicações web com tecnologias modernas. Colaboração com times multidisciplinares para entregar soluções de software de alta qualidade.`,
};

const ORIGINAL_PROMPT = `# Build a macOS inspired desktop portfolio website with placeholder content

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

2. Terminal: interactive command line with dark theme, command history (up/down arrows), monospace font, blinking cursor and these commands: help, about, ls, ls -a, cd [folder], cat [file], clear, easter eggs

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

- icons for folders, files and apps.`;

export const PROJECT_STORY_CONTENT: Loc = {
  en: `
# About This Project

*This whole desktop didn't start as a grand plan. It started as a prompt.*

## Origin

While browsing the web, I found [this article](https://promptdrivendeveloper.com/p/build-a-macos-style-portfolio-website) proposing a single prompt to generate a macOS-style interactive portfolio.

Naturally, I had to test it. I threw it at a few different AI app builders just to see who could actually pull it off. Lovable was the one that actually built it — draggable windows, a working Terminal, the whole desktop metaphor and ✨WORKING✨.

## The Prompt That Started It All

Here it is, word for word, exactly what I typed in:

\`\`\`prompt
${ORIGINAL_PROMPT}
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
`,
  "pt-BR": `# Sobre este projeto

*Toda essa área de trabalho não começou como um grande plano. Começou com um prompt.*

## A origem

Enquanto navegava pela web, encontrei [este artigo](https://promptdrivendeveloper.com/p/build-a-macos-style-portfolio-website) que propunha um único prompt para gerar um portfólio interativo no estilo macOS.

Naturalmente, eu precisava testar isso. Experimentei em algumas ferramentas diferentes de criação de apps com IA, só para ver qual delas realmente daria conta do recado. A Lovable foi a que realmente construiu o projeto — janelas arrastáveis, um Terminal funcional, toda a metáfora de área de trabalho e, o melhor: ✨FUNCIONANDO✨.

## O prompt que deu início a tudo

Aqui está, palavra por palavra, exatamente o que digitei:

\`\`\`prompt
${ORIGINAL_PROMPT}
\`\`\`

## Onde as coisas ficaram desafiadoras

O prompt, por si só, entrega uma área de trabalho funcional de verdade. Mas é um ponto de partida, não a linha de chegada. No momento em que quis adicionar novos apps e explorar mais a fundo o sistema de arquivos, continuar dentro da ferramenta de criação deixou de fazer sentido — em parte porque os limites de crédito foram atingidos 😭😭😭. Então, baixei o projeto e continuei desenvolvendo-o localmente. Gere primeiro, depois leve para o seu ambiente e dê o seu toque pessoal. 💡

## E então, tornou-se meu ❤️

Algumas das coisas que adicionei ao longo do caminho:

- **Visual próprio**: detalhes em rosa nas pastas, papéis de parede personalizados e um estilo que reflete meu gosto pessoal.
- **Conteúdo com propósito**: cada projeto organizado em uma pasta específica, uma pasta de fotos e um fluxo de navegação que também funciona como uma seção de habilidades, se você explorar um pouco.
- **Apps e widgets que eu queria**: um reprodutor de música com capa do álbum direto na área de trabalho, um app de contatos estilo iMessage e um widget de previsão do tempo em tempo real.
- **Pequenos detalhes que dão vida ao projeto**: modo claro/escuro, busca Spotlight, tela de inicialização, um post-it de boas-vindas e sons do sistema.
- **Porque todo mundo gosta de opções**: configurações de idioma, aparência, som e papel de parede.`,
};

export const LAB_CLIMA_CONTENT: Loc = {
  en: `
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


*Private repository — project images coming soon.*`,
  "pt-BR": `
# Lab Clima ☀️

*Estação Meteorológica de Monitoramento Climático*

O Rio Grande do Sul viveu de perto o peso das **enchentes** — deixando claro o quanto a **letramento climático** é urgente para as comunidades.

No Colégio João XXIII, isso se soma à localização em **ponto alto de Porto Alegre**, exposto a chuvas fortes, raios e queda de árvores, afetando uma comunidade que já percorre longas distâncias até a sala de aula.

O **Lab Clima** nasceu para mudar isso: um sistema de **baixo custo** que coleta e entrega dados climáticos locais, unindo tecnologia e prevenção para levar **segurança** e letramento climático à comunidade escolar — pensado para ser **replicável**, de modo que qualquer escola possa virar um polo de monitoramento e transformação social.

## A solução 💡

Um sistema de monitoramento climático em tempo real com dois objetivos:

- **Prevenção**, dando à comunidade escolar a informação para se preparar antes de condições adversas
- **Aprendizado prático**, usando dados reais coletados no local como ferramenta para ensinar clima aos estudantes

Fui uma das fundadoras do projeto e liderei o time do início ao fim.

## Como funciona ⚙️

Uma estação construída sobre **Raspberry Pi** acompanha continuamente as condições do tempo por meio de:

- Um sensor **BME280** (temperatura, umidade e pressão)
- Um sensor de luminosidade **BH1750**

Esses dados alimentam um modelo de previsão **VAR (Vetor Autorregressivo)**, que projeta tendências climáticas a partir do histórico coletado. As informações são armazenadas em um banco **MariaDB**, servidas por uma API em **Python/Flask** e entregues à comunidade escolar por uma interface em **React**.

## Stack

\`React\` · \`Python\` · \`Flask\` · \`Raspberry Pi\` · \`BME280\` · \`BH1750\` · \`VAR\` · \`MariaDB\`


*Repositório privado — imagens do projeto em breve.*`,
};

export const PIPELINE_EMENDAS_PIX_CONTENT: Loc = {
  en: `
# "Emendas Pix" Pipeline 📊

*Analysis of Special Transfers in Alegrete/RS (2021–2025)*

Since 2019, Constitutional Amendment No. 105 has allowed the Federal Government to transfer funds directly to municipalities without formal agreements or pre-defined purposes — known as **"Emendas Pix"**.

There is plenty of autonomy but a lack of traceability: the data exists, but it is **fragmented** across dozens of entities within the Transferegov API, with no consolidated view available.

This project was created to fill that gap: transforming scattered public data into a **systematized and reproducible** analysis of where funds in Alegrete/RS are actually going.

## The solution 💡

A data pipeline using a **Medallion architecture (Bronze → Silver → Gold)** that consolidates Transferegov action plans into a single analytical database. From this, we derive indicators of **participation, concentration, and thematic diversity** to answer three questions:

- How are funds **distributed** across thematic purposes?
- Is there **concentration** in specific areas?
- Is this pattern **stable** over time?

## How it works ⚙️

- **Acquisition**: paginated collection via the Transferegov API, including provenance metadata
- **Silver**: flattening and integration of 14 entities, data type correction, standardization, and creation of derived variables
- **Gold**: thematic expansion, mapping of purpose to area, and aggregations by purpose, area, and fiscal year

As part of the project, we also developed an **Exploratory Data Analysis** notebook based on the Gold layer, documenting the thematic aggregation process for future reference and replication.

## Reproducibility

The pipeline was designed to be **replicable in other municipalities** — by simply adjusting the data collection filter, it can generate the same type of thematic analysis for any city included in the Transferegov database.

## Stack

\`Python\` · \`pandas\` · \`numpy\` · \`matplotlib\` · \`Medallion Architecture\` · \`Transferegov API\` · \`Google Colab\`


*Academic project — open data, exploratory analysis.*`,
  "pt-BR": `
# Pipeline "Emendas Pix" 📊

*Análise das Transferências Especiais em Alegrete/RS (2021–2025)*

Desde 2019, a Emenda Constitucional nº 105 permite que a União repasse recursos diretamente aos municípios sem convênio formal ou finalidade pré-definida — as chamadas **"Emendas Pix"**.

Há bastante autonomia, mas falta rastreabilidade: os dados existem, porém estão **fragmentados** em dezenas de entidades dentro da API do Transferegov, sem nenhuma visão consolidada.

Este projeto nasceu para preencher essa lacuna: transformar dados públicos dispersos em uma análise **sistematizada e reprodutível** sobre para onde os recursos de Alegrete/RS realmente vão.

## A solução 💡

Um pipeline de dados com **arquitetura Medalhão (Bronze → Silver → Gold)** que consolida os planos de ação do Transferegov em uma única base analítica. A partir dela, derivamos indicadores de **participação, concentração e diversidade temática** para responder a três perguntas:

- Como os recursos se **distribuem** entre as finalidades temáticas?
- Existe **concentração** em áreas específicas?
- Esse padrão é **estável** ao longo do tempo?

## Como funciona ⚙️

- **Aquisição**: coleta paginada via API do Transferegov, incluindo metadados de proveniência
- **Silver**: achatamento e integração de 14 entidades, correção de tipos, padronização e criação de variáveis derivadas
- **Gold**: expansão temática, mapeamento de finalidade para área e agregações por finalidade, área e exercício

Como parte do projeto, também desenvolvemos um notebook de **Análise Exploratória de Dados** sobre a camada Gold, documentando o processo de agregação temática para consulta e replicação futuras.

## Reprodutibilidade

O pipeline foi desenhado para ser **replicável em outros municípios** — bastando ajustar o filtro de coleta, ele gera o mesmo tipo de análise temática para qualquer cidade presente na base do Transferegov.

## Stack

\`Python\` · \`pandas\` · \`numpy\` · \`matplotlib\` · \`Arquitetura Medalhão\` · \`API Transferegov\` · \`Google Colab\`


*Projeto acadêmico — dados abertos, análise exploratória.*`,
};

export const TUTOR_METODO_CIENTIFICO_CONTENT: Loc = {
  en: `
# Scientific Method Intelligent Tutor 🔬

*Intelligent Tutoring System (ITS) for the topic definition phase*

Every researcher has experienced that moment: starting a master's degree, a head full of scattered ideas, and facing the hardest question of all — "what, exactly, is my research topic?" The idea for this project — developed as part of my **master's research** — was born from watching lab colleagues feel lost at precisely this stage.

The original goal was ambitious: to cover the **entire process of building an academic research project**. However, as the project was too large for a first step, the scope was narrowed — shifting the starting point to the **research topic selection** phase within the scientific method.

## The Solution 💡

An intelligent tutor MVP built on a **multi-agent architecture**, where each agent plays a specific role in the student's journey:

- **Tutor Agent** — manages the interaction with the student
- **Planner** — organizes the pedagogical flow
- **Student Model Agent** — models the student's progress and profile
- **Content Generation Agent** — generates tailored content
- **Feasibility Agent** — evaluates the feasibility of proposed topics

## Status

Project currently **under development** — the focus is on validating the MVP for the topic definition phase before expanding to other stages of the scientific methodology.

## Stack

\`Python\` · \`LangGraph\` · \`Chainlit\` · \`Ollama\` · \`SQLite\`


*Master's research in progress.*`,
  "pt-BR": `
# Tutor Inteligente de Método Científico 🔬

*Sistema Tutor Inteligente (STI) para a fase de definição de tema*

Todo pesquisador já viveu aquele momento: começando o mestrado, a cabeça cheia de ideias soltas e diante da pergunta mais difícil de todas — "qual é, exatamente, o meu tema de pesquisa?" A ideia deste projeto — desenvolvido como parte da minha **pesquisa de mestrado** — nasceu de ver colegas de laboratório se perderem justamente nessa etapa.

O objetivo original era ambicioso: cobrir **todo o processo de construção de um projeto de pesquisa acadêmica**. Como o escopo era grande demais para um primeiro passo, ele foi reduzido — deslocando o ponto de partida para a fase de **escolha do tema de pesquisa** dentro do método científico.

## A Solução 💡

Um MVP de tutor inteligente construído sobre uma **arquitetura multiagente**, em que cada agente cumpre um papel específico na jornada do estudante:

- **Agente Tutor** — conduz a interação com o estudante
- **Planejador** — organiza o fluxo pedagógico
- **Agente de Modelo do Estudante** — modela o progresso e o perfil do estudante
- **Agente de Geração de Conteúdo** — gera conteúdo sob medida
- **Agente de Viabilidade** — avalia a viabilidade dos temas propostos

## Status

Projeto **em desenvolvimento** — o foco está em validar o MVP para a fase de definição de tema antes de expandir para as demais etapas da metodologia científica.

## Stack

\`Python\` · \`LangGraph\` · \`Chainlit\` · \`Ollama\` · \`SQLite\`


*Pesquisa de mestrado em andamento.*`,
};

export const SECRETS_CONTENT: Loc = {
  en: `You found the hidden file. Try 'matrix' in the Terminal. 🕶`,
  "pt-BR": `Você achou o arquivo escondido. Experimente 'matrix' no Terminal. 🕶`,
};

export const README_CONTENT: Loc = {
  en: `# Hey, I'm Andressa 👋

Product designer & developer based in Porto Alegre, BR.

## About
I build interfaces that feel alive — expressive, calm, and a little playful. I love the intersection of craft, code, and story.

## Links
- Email — andressa.rodrigues19@outlook.com
- LinkedIn — /in/andressa
- GitHub — /andressa

*Open folders on the desktop to explore experience, projects, and adventures.*`,
  "pt-BR": `# Oi, eu sou a Andressa 👋

Designer de produto e desenvolvedora em Porto Alegre, BR.

## Sobre
Crio interfaces vivas — expressivas, calmas e um pouco divertidas. Amo a interseção entre ofício, código e história.

## Links
- E-mail — andressa.rodrigues19@outlook.com
- LinkedIn — /in/andressa
- GitHub — /andressa

*Abra as pastas na area de trabalho para ver experiência, projetos e aventuras.*`,
};

export interface RecommendationEmail {
  id: string;
  from: string;
  fromEmail: string;
  date: string;
  starred?: boolean;
  role: string;
  preview: Loc;
  body: Loc;
}

export const RECOMMENDATIONS: RecommendationEmail[] = [
  {
    id: "1",
    from: "Valesca Cechin",
    fromEmail: "ValescaCechin@mail.com",
    date: "2026-04-06",
    starred: true,
    role: "Senior UX Designer",
    preview: {
      en: "I had the opportunity to work with Andressa, and I can say that she stands out...",
      "pt-BR":
        "Tive a oportunidade de trabalhar com a Andressa e posso dizer que ela se destaca...",
    },
    body: {
      "pt-BR": `Tive a oportunidade de trabalhar com a Andressa e posso dizer que ela se destaca tanto pela sua **qualidade técnica** quanto pela sua **visão de produto**.

Ela possui uma forte capacidade de construir **componentes reutilizáveis e consistentes**, garantindo interfaces bem estruturadas, traduzindo decisões de design em código com alta fidelidade — o que impacta diretamente na qualidade da experiência do usuário.

Além disso, ela tem uma **visão ampla de produto**, contribuindo para a construção de soluções eficientes e bem pensadas.

*Recomendo fortemente o trabalho dela.*`,
      en: `I had the opportunity to work with Andressa, and I can say that she stands out for both her **technical quality** and her **product vision**.

She excels at building **reusable and consistent components**, ensuring well-structured interfaces and translating design decisions into code with high fidelity — factors that directly impact the quality of the user experience.

Furthermore, she has a **broad product perspective**, contributing to the creation of efficient and well-thought-out solutions.

*I highly recommend her work.*`,
    },
  },
];
