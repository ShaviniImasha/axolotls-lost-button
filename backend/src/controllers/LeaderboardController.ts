/**
 * Leaderboard Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates leaderboard data fetching, difficulty filters, and rank calculations.
 */

import { LeaderboardModel, type LeaderboardFilter, type RankedLeaderboardPlayer } from '../models/LeaderboardModel';
import { leaderboardRepository } from '../repositories/LeaderboardRepository';

export class LeaderboardController {
  private leaderboardModel: LeaderboardModel;

  constructor(leaderboardModel?: LeaderboardModel) {
    this.leaderboardModel = leaderboardModel || new LeaderboardModel();
  }

  public async refreshLeaderboard(): Promise<RankedLeaderboardPlayer[]> {
    const entries = await leaderboardRepository.fetchLeaderboard(50);
    this.leaderboardModel.setEntries(entries);
    return this.leaderboardModel.getRankedEntries();
  }

  public setFilter(filter: LeaderboardFilter): RankedLeaderboardPlayer[] {
    this.leaderboardModel.setFilter(filter);
    return this.leaderboardModel.getRankedEntries();
  }

  public getRankings(): RankedLeaderboardPlayer[] {
    return this.leaderboardModel.getRankedEntries();
  }

  public getPlayerRank(playerId: string): number | null {
    return this.leaderboardModel.getCurrentPlayerRank(playerId);
  }
}

export const leaderboardController = new LeaderboardController();
