// Leaderboard Types
export interface Player {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerInput {
  name: string;
  wpm: number;
  accuracy: number;
}