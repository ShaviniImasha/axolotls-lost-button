/**
 * Leaderboard Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages player rankings, sorting by total score / pearls, difficulty filters, and rank calculations.
 */

import type { AssetName } from '../assets';
import type { Difficulty } from '../game/levelManager';

export type LeaderboardFilter = Difficulty | 'all';

export interface LeaderboardPlayer {
  playerId: string;
  name: string;
  avatar: AssetName;
  score: number;
  pearls: number;
  completedLevelsCount: number;
  isCurrentPlayer?: boolean;
}

export interface RankedLeaderboardPlayer extends LeaderboardPlayer {
  rank: number;
}

export class LeaderboardModel {
  private entries: LeaderboardPlayer[] = [];
  private activeFilter: LeaderboardFilter = 'all';

  constructor(initialEntries: LeaderboardPlayer[] = []) {
    this.entries = [...initialEntries];
  }

  public setEntries(entries: LeaderboardPlayer[]): void {
    this.entries = [...entries];
  }

  public setFilter(filter: LeaderboardFilter): void {
    this.activeFilter = filter;
  }

  public getFilter(): LeaderboardFilter {
    return this.activeFilter;
  }

  public getRankedEntries(limitCount = 20): RankedLeaderboardPlayer[] {
    const sorted = [...this.entries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.pearls !== a.pearls) return b.pearls - a.pearls;
      return b.completedLevelsCount - a.completedLevelsCount;
    });

    return sorted.slice(0, limitCount).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  public getCurrentPlayerRank(playerId: string): number | null {
    const ranked = this.getRankedEntries(100);
    const found = ranked.find((p) => p.playerId === playerId);
    return found ? found.rank : null;
  }
}
