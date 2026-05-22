export interface Setlist {
  id: string;
  title: string;
  duration: string;
  tags: string[];
  bpm: number;
}

export const MOCK_SETLISTS: Setlist[] = [
  {
    id: "1",
    title: "Midnight Neon Pulse",
    duration: "45:20",
    tags: ["Future Bass", "Roblox EDM"],
    bpm: 128,
  },
  {
    id: "2",
    title: "Cyber City Horizon",
    duration: "32:15",
    tags: ["Synthwave", "Cyberpunk"],
    bpm: 110,
  },
  {
    id: "3",
    title: "Digital Riot [Live 2024]",
    duration: "58:40",
    tags: ["Hardstyle", "Virtual Rave"],
    bpm: 155,
  },
  {
    id: "4",
    title: "Vapor Wave Odyssey",
    duration: "28:10",
    tags: ["Chill", "Lo-fi"],
    bpm: 90,
  },
  {
    id: "5",
    title: "Glitched Reality",
    duration: "41:30",
    tags: ["Glitch Hop", "Drum & Bass"],
    bpm: 174,
  },
  {
    id: "6",
    title: "Ayyi's Signature Mix",
    duration: "1:05:00",
    tags: ["Progressive House"],
    bpm: 126,
  }
];
