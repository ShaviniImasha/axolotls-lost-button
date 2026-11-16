export interface LeaderboardEntry { playerId: string; name: string; avatar: string; score: number; pearls: number; completedLevelsCount: number; rank?: number; }

export const LeaderboardModel = {
  rankEntries(entries: LeaderboardEntry[]): Array<LeaderboardEntry & { rank: number }> {
    return [...entries].sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));
  },
};
