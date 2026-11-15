/**
 * Result View
 * Model-View-Controller (MVC) - View Layer
 * Renders the level completion celebration screen with star awards and score breakdown.
 */

import { renderLevelCompleteScreen, type LevelCompleteScreenProps } from '../../components/LevelCompleteScreen';

export class ResultView {
  public static render(props: LevelCompleteScreenProps): string {
    return renderLevelCompleteScreen(props);
  }
}
