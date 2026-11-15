/**
 * Leaderboard View
 * Model-View-Controller (MVC) - View Layer
 * Renders player rankings, podium, difficulty filters, and player ranking rows.
 */

import { renderLeaderboardScreen, type LeaderboardScreenProps } from '../../components/LeaderboardScreen';

export class LeaderboardView {
  public static render(props: LeaderboardScreenProps): string {
    return renderLeaderboardScreen(props);
  }
}
