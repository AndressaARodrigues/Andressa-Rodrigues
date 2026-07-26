import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Loc } from "@/lib/content";

export type Lang = "en" | "pt-BR";

const KEY = "portfolio-lang";

const EN = {
  // ── Apps & chrome ────────────────────────────────────────────────
  finder: "Finder",
  aboutMe: "About Me",
  terminal: "Terminal",
  messages: "Messages",
  music: "Music",
  mail: "Mail",
  preview: "Preview",
  photos: "Photos",
  textEdit: "TextEdit",
  solitaire: "Solitaire",
  settings: "System Settings",
  trash: "Trash",
  adventures: "Adventures",
  projects: "Projects",
  skills: "Skills",
  demo: "Experience",
  home: "Home",
  portfolioName: "Andressa's Portfolio",
  weatherApp: "Weather",

  // ── Menu bar ─────────────────────────────────────────────────────
  menuFile: "File",
  menuEdit: "Edit",
  menuView: "View",
  menuWindow: "Window",
  menuHelp: "Help",
  menuGo: "Go",
  menuShell: "Shell",
  menuMailbox: "Mailbox",
  menuMessage: "Message",
  menuSong: "Song",
  menuGame: "Game",
  menuTools: "Tools",
  menuImage: "Image",
  menuForecast: "Forecast",
  appleMenu: "Apple menu",
  aboutThisPortfolio: "About This Portfolio",
  showWelcomeNote: "Show Welcome Note",
  hideWelcomeNote: "Hide Welcome Note",
  sleep: "Sleep",
  restart: "Restart…",
  shutDown: "Shut Down…",
  toggleTheme: "Toggle appearance",
  spotlightSearch: "Spotlight Search",
  noItems: "No items",

  // ── Window chrome ────────────────────────────────────────────────
  close: "Close",
  minimize: "Minimize",
  maximize: "Maximize",

  // ── Settings ─────────────────────────────────────────────────────
  language: "Language",
  appearance: "Appearance",
  light: "Light",
  dark: "Dark",
  auto: "Auto",
  sound: "Sound",
  mute: "Mute",
  unmute: "Unmute",
  systemSounds: "System sounds",
  systemSoundsDesc: "Subtle clicks, whooshes and pops when you interact with the desktop.",
  wallpaper: "Wallpaper",
  themeColor: "Theme Color",
  cursor: "Cursor",
  catCursor: "Cat & Yarn Cursor",
  catCursorDesc: "Turn your pointer into a ball of yarn — a cat chases it across the screen.",
  languageDesc: "Switch the entire system between English and Brazilian Portuguese.",
  appearanceDesc: "Choose a light or dark look, or follow your system setting.",
  wallpaperDefault: "Default Gradient",
  wallpaperRio: "Rio",
  wallpaperItaly: "Italy",
  wallpaperJapan: "Japan",
  wallpaperBigSur: "Big Sur",
  on: "On",
  off: "Off",

  // ── Weather ──────────────────────────────────────────────────────
  weather: "Weather",
  portoAlegre: "Porto Alegre, BR",
  brazil: "Brazil",
  hourlyForecast: "Hourly Forecast",
  dailyForecast: "7-Day Forecast",
  now: "Now",
  feelsLike: "Feels Like",
  humidity: "Humidity",
  wind: "Wind",
  precipitation: "Precipitation",
  high: "H",
  low: "L",
  today: "Today",
  loading: "Loading…",
  condClear: "Clear",
  condMostlyClear: "Mostly Clear",
  condCloudy: "Cloudy",
  condFog: "Fog",
  condDrizzle: "Drizzle",
  condRain: "Rain",
  condSnow: "Snow",
  condShowers: "Showers",
  condThunderstorm: "Thunderstorm",

  // ── Messages ─────────────────────────────────────────────────────
  typeMessage: "Type a message…",
  sending: "Sending…",
  delivered: "Delivered",
  typing: "typing…",
  autoReply:
    "Thanks for reaching out! I'll reply from andressa.rodrigues19@outlook.com within 1–2 days.",
  messagesIntro: "Hi! Leave a message and I'll get back to you 💌",
  send: "Send",
  sendByEmail: "Prefer to send me an email?",

  // ── Music ────────────────────────────────────────────────────────
  playlist: "Playlist",
  nowPlaying: "Now Playing",
  play: "Play",
  pause: "Pause",
  nextTrack: "Next track",
  prevTrack: "Previous track",
  loadingPreview: "Loading preview…",
  hideMusicPlayer: "Hide music player",
  openMusic: "Open Music",

  // ── Finder ───────────────────────────────────────────────────────
  favorites: "Favorites",
  locations: "Locations",
  macintoshHD: "Macintosh HD",
  searchPlaceholder: "Search",
  emptyFolder: "This folder is empty",
  items: "items",
  item: "item",
  gridView: "Icon view",
  listView: "List view",
  back: "Back",
  forward: "Forward",
  name: "Name",
  kind: "Kind",
  folder: "Folder",
  file: "File",
  document: "Document",
  image: "Image",
  pdf: "PDF",

  // ── Mail ─────────────────────────────────────────────────────────
  inbox: "Inbox",
  starred: "Starred",
  sent: "Sent",
  archive: "Archive",

  // ── PDF ──────────────────────────────────────────────────────────
  resumePdf: "resume.pdf",
  print: "Print",
  download: "Download",
  skillsMd: "skills.md",

  // ── Spotlight ────────────────────────────────────────────────────
  spotlightPlaceholder: "Spotlight Search",
  spotlightNoResults: "No results",
  applications: "Applications",
  documents: "Documents",

  // ── Sticky / boot ────────────────────────────────────────────────
  stickyWelcome:
    "Hi, I'm Andressa 👋\nWelcome to my desktop. Open the apps, poke around the folders, and try the Terminal. Enjoy!",
  closeStickyNote: "Close sticky note",
  skipBoot: "Click to skip",

  // ── Solitaire ────────────────────────────────────────────────────
  newGame: "New Game",
  score: "Score",
  time: "Time",
  moves: "Moves",
  youWin: "You win!",

  // ── Terminal ─────────────────────────────────────────────────────
  termWelcome: "Welcome to the portfolio shell. Type `help` to get started.",
  termHelpTitle: "Available commands",
  termHelpHelp: "list all commands",
  termHelpAbout: "open the readme",
  termHelpLs: "list the current directory",
  termHelpLsA: "include hidden files",
  termHelpCd: "change directory",
  termHelpCat: "print a file",
  termHelpOpen: "open a file in its app",
  termHelpPwd: "print the working directory",
  termHelpSkills: "list my skills",
  termHelpStory: "the story behind this project",
  termHelpClear: "clear the screen",
  termHelpSecret: "…and a few secrets. Try guessing.",
  termNotFound: "command not found",
  termNoSuchFile: "no such file or directory",
  termNotADirectory: "not a directory",
  termIsADirectory: "is a directory",
  termBinaryFile: "(binary file)",
  termUsageCd: "usage: cd [folder]",
  termUsageCat: "usage: cat [file]",
  termCoffee: "Brewing… ☕ (this shell is not a coffee machine, but it tries)",

  thisIsMe: "This is me!",
  aboutTitle: "About Me",
  educationTitle: "Education",

  trashSpam1: "Hey, cut it out 😤",
  trashSpam2: "Seriously, stop.",
  trashSpam3: "Fine, you win 🏳️",
  trashReturnMessage: "Relax, nothing gets deleted here 😌",
  clickToUnlock: "Click or press any key to unlock",
} as const;

type Key = keyof typeof EN;

const PT: Record<Key, string> = {
  finder: "Finder",
  aboutMe: "Sobre Mim",
  terminal: "Terminal",
  messages: "Mensagens",
  music: "Música",
  mail: "E-mail",
  preview: "Visualização",
  photos: "Fotos",
  textEdit: "TextEdit",
  solitaire: "Paciência",
  settings: "Ajustes do Sistema",
  trash: "Lixeira",
  adventures: "Aventuras",
  projects: "Projetos",
  skills: "Habilidades",
  demo: "Experiência",
  home: "Início",
  portfolioName: "Portfólio da Andressa",
  weatherApp: "Clima",

  menuFile: "Arquivo",
  menuEdit: "Editar",
  menuView: "Visualizar",
  menuWindow: "Janela",
  menuHelp: "Ajuda",
  menuGo: "Ir",
  menuShell: "Shell",
  menuMailbox: "Caixa de Correio",
  menuMessage: "Mensagem",
  menuSong: "Música",
  menuGame: "Jogo",
  menuTools: "Ferramentas",
  menuImage: "Imagem",
  menuForecast: "Previsão",
  appleMenu: "Menu Apple",
  aboutThisPortfolio: "Sobre Este Portfólio",
  showWelcomeNote: "Mostrar Boas-vindas",
  hideWelcomeNote: "Ocultar nota de boas-vindas",
  sleep: "Repousar",
  restart: "Reiniciar…",
  shutDown: "Desligar…",
  toggleTheme: "Alternar aparência",
  spotlightSearch: "Busca do Spotlight",
  noItems: "Sem itens",

  close: "Fechar",
  minimize: "Minimizar",
  maximize: "Maximizar",

  language: "Idioma",
  appearance: "Aparência",
  light: "Claro",
  dark: "Escuro",
  auto: "Automático",
  sound: "Som",
  mute: "Silenciar",
  unmute: "Ativar som",
  systemSounds: "Sons do sistema",
  systemSoundsDesc: "Cliques, sopros e pops sutis ao interagir com a mesa.",
  wallpaper: "Papel de Parede",
  themeColor: "Cor do Tema",
  cursor: "Cursor",
  catCursor: "Cursor Gato & Novelo",
  catCursorDesc: "Transforma o ponteiro em um novelo de lã — um gato o persegue pela tela.",
  languageDesc: "Alterna todo o sistema entre inglês e português do Brasil.",
  appearanceDesc: "Escolha um visual claro ou escuro, ou siga o ajuste do sistema.",
  wallpaperDefault: "Gradiente Padrão",
  wallpaperRio: "Rio",
  wallpaperItaly: "Itália",
  wallpaperJapan: "Japão",
  wallpaperBigSur: "Big Sur",
  on: "Ligado",
  off: "Desligado",

  weather: "Clima",
  portoAlegre: "Porto Alegre, BR",
  brazil: "Brasil",
  hourlyForecast: "Previsão por Hora",
  dailyForecast: "Previsão de 7 Dias",
  now: "Agora",
  feelsLike: "Sensação",
  humidity: "Umidade",
  wind: "Vento",
  precipitation: "Precipitação",
  high: "Máx",
  low: "Mín",
  today: "Hoje",
  loading: "Carregando…",
  condClear: "Céu limpo",
  condMostlyClear: "Predomínio de sol",
  condCloudy: "Nublado",
  condFog: "Neblina",
  condDrizzle: "Garoa",
  condRain: "Chuva",
  condSnow: "Neve",
  condShowers: "Pancadas de chuva",
  condThunderstorm: "Tempestade",

  typeMessage: "Digite uma mensagem…",
  sending: "Enviando…",
  delivered: "Entregue",
  typing: "digitando…",
  autoReply:
    "Obrigada pelo contato! Responderei em 1–2 dias pelo andressa.rodrigues19@outlook.com.",
  messagesIntro: "Olá! Deixe uma mensagem e eu retorno o contato 💌",
  send: "Enviar",
  sendByEmail: "Prefere me mandar por e-mail?",

  playlist: "Playlist",
  nowPlaying: "Tocando Agora",
  play: "Tocar",
  pause: "Pausar",
  nextTrack: "Próxima faixa",
  prevTrack: "Faixa anterior",
  loadingPreview: "Carregando prévia…",
  hideMusicPlayer: "Ocultar player de música",
  openMusic: "Abrir Música",

  favorites: "Favoritos",
  locations: "Locais",
  macintoshHD: "Macintosh HD",
  searchPlaceholder: "Buscar",
  emptyFolder: "Esta pasta está vazia",
  items: "itens",
  item: "item",
  gridView: "Visualização em ícones",
  listView: "Visualização em lista",
  back: "Voltar",
  forward: "Avançar",
  name: "Nome",
  kind: "Tipo",
  folder: "Pasta",
  file: "Arquivo",
  document: "Documento",
  image: "Imagem",
  pdf: "PDF",

  inbox: "Entrada",
  starred: "Favoritos",
  sent: "Enviados",
  archive: "Arquivo",

  resumePdf: "curriculo.pdf",
  print: "Imprimir",
  download: "Baixar",
  skillsMd: "Habilidades.md",

  spotlightPlaceholder: "Busca do Spotlight",
  spotlightNoResults: "Sem resultados",
  applications: "Aplicativos",
  documents: "Documentos",

  stickyWelcome:
    "Oi, eu sou a Andressa 👋\nBem-vindo(a) à minha área de trabalho. Abra os apps, explore as pastas e experimente o Terminal. Divirta-se!",
  closeStickyNote: "Fechar o post-it",
  skipBoot: "Clique para sair",

  newGame: "Novo Jogo",
  score: "Pontos",
  time: "Tempo",
  moves: "Jogadas",
  youWin: "Você venceu!",

  termWelcome: "Bem-vindo(a) ao shell do portfólio. Digite `help` para começar.",
  termHelpTitle: "Comandos disponíveis",
  termHelpHelp: "lista todos os comandos",
  termHelpAbout: "abre o leiame",
  termHelpLs: "lista o diretório atual",
  termHelpLsA: "inclui arquivos ocultos",
  termHelpCd: "muda de diretório",
  termHelpCat: "exibe um arquivo",
  termHelpOpen: "abre um arquivo no app dele",
  termHelpPwd: "mostra o diretório atual",
  termHelpSkills: "lista minhas habilidades",
  termHelpStory: "a história por trás deste projeto",
  termHelpClear: "limpa a tela",
  termHelpSecret: "…e alguns segredos. Tente adivinhar.",
  termNotFound: "comando não encontrado",
  termNoSuchFile: "arquivo ou diretório inexistente",
  termNotADirectory: "não é um diretório",
  termIsADirectory: "é um diretório",
  termBinaryFile: "(arquivo binário)",
  termUsageCd: "uso: cd [pasta]",
  termUsageCat: "uso: cat [arquivo]",
  termCoffee: "Preparando… ☕ (este shell não é uma cafeteira, mas se esforça)",

  thisIsMe: "Esta sou eu!",
  aboutTitle: "Sobre Mim",
  educationTitle: "Educação",

  trashSpam1: "Ei, para com isso 😤",
  trashSpam2: "Sério, para.",
  trashSpam3: "Tá bom, você venceu 🏳️",
  trashReturnMessage: "Relaxa, nada é deletado de verdade aqui 😌",

  clickToUnlock: "Clique ou aperte qualquer tecla para desbloquear",
};

const DICT: Record<Lang, Record<Key, string>> = { en: EN, "pt-BR": PT };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  tl: (v: Loc | undefined) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" && (localStorage.getItem(KEY) as Lang | null)) || "en";
    if (stored === "en" || stored === "pt-BR") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* noop */
    }
  };

  const t = (k: Key) => DICT[lang][k] ?? EN[k];
  const tl = (v: Loc | undefined) => (v ? (v[lang] ?? v.en) : "");

  return <I18nContext.Provider value={{ lang, setLang, t, tl }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
