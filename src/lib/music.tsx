import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSounds } from "@/lib/sounds";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // fallback seconds (real audio uses preview duration)
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Praise You",
    artist: "Fatboy Slim",
    duration: 30,
    color: "from-amber-300 to-orange-500",
  },
  {
    id: "2",
    title: "The Cure",
    artist: "Olivia Rodrigo",
    duration: 30,
    color: "from-rose-300 to-pink-500",
  },
  {
    id: "3",
    title: "Basket Case",
    artist: "Green Day",
    duration: 30,
    color: "from-lime-300 to-emerald-500",
  },
  {
    id: "4",
    title: "Ghost",
    artist: "Justin Bieber",
    duration: 30,
    color: "from-sky-300 to-indigo-500",
  },
  {
    id: "5",
    title: "In the End",
    artist: "Linkin Park",
    duration: 30,
    color: "from-neutral-400 to-neutral-700",
  },
  {
    id: "6",
    title: "Sick Love",
    artist: "Red Hot Chili Peppers",
    duration: 30,
    color: "from-red-400 to-rose-600",
  },
  {
    id: "7",
    title: "I Like the Way You Kiss Me",
    artist: "Artemas",
    duration: 30,
    color: "from-fuchsia-400 to-purple-600",
  },
  {
    id: "8",
    title: "You Da One",
    artist: "Rihanna",
    duration: 30,
    color: "from-pink-400 to-fuchsia-500",
  },
  {
    id: "9",
    title: "Seven Nation Army",
    artist: "The White Stripes",
    duration: 30,
    color: "from-red-500 to-neutral-800",
  },
  {
    id: "10",
    title: "Girls",
    artist: "The Kid LAROI",
    duration: 30,
    color: "from-violet-400 to-indigo-600",
  },
  {
    id: "11",
    title: "Baby, Now That I've Found You",
    artist: "The Foundations",
    duration: 30,
    color: "from-yellow-300 to-amber-500",
  },
  { id: "12", title: "Dynamite", artist: "BTS", duration: 30, color: "from-pink-300 to-rose-500" },
  {
    id: "13",
    title: "NUEVAYoL",
    artist: "Bad Bunny",
    duration: 30,
    color: "from-emerald-400 to-teal-600",
  },
];

interface MusicCtx {
  track: Track;
  index: number;
  playing: boolean;
  progress: number;
  duration: number;
  hasAudio: boolean;
  artworks: Record<string, string>;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  select: (i: number) => void;
  seek: (p: number) => void;
}

const MusicContext = createContext<MusicCtx | null>(null);

interface ITunesResult {
  previewUrl?: string;
  artworkUrl100?: string;
}
interface ITunesResponse {
  results?: ITunesResult[];
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(1); // default: Praise You — Fatboy Slim
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [artworks, setArtworks] = useState<Record<string, string>>({});
  const track = TRACKS[index];

  // Fetch iTunes 30s previews + artwork for real audio playback.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const prev: Record<string, string> = {};
      const art: Record<string, string> = {};
      await Promise.all(
        TRACKS.map(async (t) => {
          try {
            const q = encodeURIComponent(`${t.title} ${t.artist}`);
            const r = await fetch(
              `https://itunes.apple.com/search?term=${q}&limit=1&media=music&entity=song`,
            );
            const j = (await r.json()) as ITunesResponse;
            const url = j.results?.[0]?.previewUrl;
            const aw = j.results?.[0]?.artworkUrl100;
            if (url) prev[t.id] = url;
            if (aw) art[t.id] = aw.replace("100x100", "300x300");
          } catch {
            /* noop */
          }
        }),
      );
      if (!cancelled) {
        setPreviews(prev);
        setArtworks(art);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // When track or preview URLs change, update audio src.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = previews[track.id];
    if (!src) return;
    if (audio.src !== src) {
      audio.src = src;
      audio.currentTime = 0;
      if (playing) audio.play().catch(() => setPlaying(false));
    }
  }, [track.id, previews, playing]);

  // Play/pause the audio element.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing]);

  // Global mute toggle should silence music too.
  const { muted } = useSounds();
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = muted;
  }, [muted]);

  const value: MusicCtx = {
    track,
    index,
    playing,
    progress,
    duration,
    hasAudio: !!previews[track.id],
    artworks,
    toggle: () => setPlaying((p) => !p),
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    next: () => {
      setIndex((i) => (i + 1) % TRACKS.length);
      setProgress(0);
    },
    prev: () => {
      setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
      setProgress(0);
    },
    select: (i) => {
      setIndex(i);
      setProgress(0);
      setPlaying(true);
    },
    seek: (p) => {
      const audio = audioRef.current;
      if (audio) audio.currentTime = Math.max(0, Math.min(duration, p));
      setProgress(p);
    },
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        muted={muted}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
        onEnded={() => {
          setIndex((i) => (i + 1) % TRACKS.length);
          setProgress(0);
        }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic outside MusicProvider");
  return ctx;
}
