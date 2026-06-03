export interface Setlist {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
  tags: string[];
  bpm?: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentSetlist: Setlist | null;
}
