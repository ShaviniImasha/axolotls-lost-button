/**
 * Leaderboard Model
 * Backend MVC - Model Layer
 */

export interface LeaderboardRankEntry {
  rank: number;
  playerId: string;
  name: string;
  avatar: string;
  score: number;
  pearls: number;
  completedLevelsCount: number;
}

export class LeaderboardModel {
  public static rankEntries(entries: Array<Omit<LeaderboardRankEntry, 'rank'>>): LeaderboardRankEntry[] {
    const sorted = [...entries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.pearls !== a.pearls) return b.pearls - a.pearls;
      return b.completedLevelsCount - a.completedLevelsCount;
    });

    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}
