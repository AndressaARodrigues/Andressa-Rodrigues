import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "pt-BR";

const KEY = "portfolio-lang";

const DICT = {
  en: {
    finder: "Finder",
    aboutMe: "About Me",
    terminal: "Terminal",
    messages: "Messages",
    music: "Music",
    mail: "Mail",
    preview: "Preview",
    solitaire: "Solitaire",
    settings: "System Settings",
    trash: "Trash",
    adventures: "Adventures",
    projects: "Projects",
    skills: "Skills",
    demo: "Experience",
    home: "Home",
    portfolioName: "Andressa's Portfolio",
    language: "Language",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    weather: "Weather",
    portoAlegre: "Porto Alegre, BR",
    typeMessage: "Type a message...",
    sending: "Sending...",
    delivered: "Delivered",
    autoReply:
      "Thanks for reaching out! I'll reply from andressa.rodrigues19@outlook.com within 1-2 days.",
    playlist: "Playlist",
    resumePdf: "resume.pdf",
    skillsMd: "skills.md",
    stickyWelcome:
      "Hi, I'm Andressa 👋\nWelcome to my desktop. Open the apps, explore the folders, and try the Terminal. Enjoy!",
    spotlightPlaceholder: "Spotlight Search",
    spotlightNoResults: "No results",
    sound: "Sound",
    mute: "Mute",
    unmute: "Unmute",
    systemSounds: "System sounds",
    systemSoundsDesc: "Subtle clicks, whooshes and pops when you interact with the desktop.",
    wallpaper: "Wallpaper",
    themeColor: "Theme Color",
    showWelcomeNote: "Show Welcome Note",
    hideWelcomeNote: "Hide Welcome Note",
    aboutThisPortfolio: "About This Portfolio",
    sleep: "Sleep",
    restart: "Restart...",
    shutDown: "Shut Down...",
    favorites: "Favorites",
    locations: "Locations",
    search: "Search",
    noItems: "No items",
    folder: "Folder",
    file: "File",
    application: "Application",
    document: "Document",
    photo: "Photo",
    game: "Game",
    projectStory: "Project Story",
    catMode: "Cat mode",
    catModeDesc: "Replace the cursor with a yarn ball and let the cat chase it across the desktop.",
    readmeContent: `# Hey, I'm Andressa 👋

Product designer & developer based in Porto Alegre, BR.

## About
I build interfaces that feel alive - expressive, calm, and a little playful. I love the intersection of craft, code, and story.

## Links
- Email - andressa.rodrigues19@outlook.com
- LinkedIn - /in/andressa
- GitHub - /andressa

*Open folders on the desktop to explore experience, projects, and adventures.*`,
  },
  "pt-BR": {
    finder: "Finder",
    aboutMe: "Sobre Mim",
    terminal: "Terminal",
    messages: "Mensagens",
    music: "Música",
    mail: "E-mail",
    preview: "Visualização",
    solitaire: "Paciência",
    settings: "Ajustes do Sistema",
    trash: "Lixeira",
    adventures: "Adventures",
    projects: "Projetos",
    skills: "Habilidades",
    demo: "Experiência",
    home: "Início",
    portfolioName: "Portfólio da Andressa",
    language: "Idioma",
    appearance: "Aparência",
    light: "Claro",
    dark: "Escuro",
    auto: "Automático",
    weather: "Clima",
    portoAlegre: "Porto Alegre, BR",
    typeMessage: "Digite uma mensagem...",
    sending: "Enviando...",
    delivered: "Entregue",
    autoReply:
      "Obrigada pelo contato! Responderei em 1-2 dias pelo andressa.rodrigues19@outlook.com.",
    playlist: "Playlist",
    resumePdf: "curriculo.pdf",
    skillsMd: "Habilidades.md",
    stickyWelcome:
      "Oi, eu sou a Andressa 👋\nBem-vindo(a) ao meu desktop. Abra os apps, explore as pastas e experimente o Terminal. Divirta-se!",
    spotlightPlaceholder: "Busca do Spotlight",
    spotlightNoResults: "Sem resultados",
    sound: "Som",
    mute: "Silenciar",
    unmute: "Ativar som",
    systemSounds: "Sons do sistema",
    systemSoundsDesc: "Cliques, whooshes e pops sutis ao interagir com o desktop.",
    wallpaper: "Papel de Parede",
    themeColor: "Cor do Tema",
    showWelcomeNote: "Mostrar nota de boas-vindas",
    hideWelcomeNote: "Ocultar nota de boas-vindas",
    aboutThisPortfolio: "Sobre este Portfólio",
    sleep: "Repousar",
    restart: "Reiniciar...",
    shutDown: "Desligar...",
    favorites: "Favoritos",
    locations: "Locais",
    search: "Buscar",
    noItems: "Sem itens",
    folder: "Pasta",
    file: "Arquivo",
    application: "Aplicativo",
    document: "Documento",
    photo: "Foto",
    game: "Jogo",
    projectStory: "História do Projeto",
    catMode: "Modo gato",
    catModeDesc: "Troca o cursor por uma bolinha de lã e deixa o gato persegui-la pelo desktop.",
    readmeContent: `# Oi, eu sou a Andressa 👋

Designer de produto e desenvolvedora em Porto Alegre, BR.

## Sobre
Crio interfaces vivas - expressivas, calmas e um pouco divertidas. Amo a interseção entre ofício, código e história.

## Links
- E-mail - andressa.rodrigues19@outlook.com
- LinkedIn - /in/andressa
- GitHub - /andressa

*Abra as pastas no desktop para ver experiência, projetos e adventures.*`,
  },
} as const;

type Key = keyof typeof DICT.en;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" && (localStorage.getItem(KEY) as Lang | null)) || "en";
    setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* noop */
    }
  };

  const t = (k: Key) => DICT[lang][k] ?? DICT.en[k];

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
