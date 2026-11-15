/**
 * Level Selection View
 * Model-View-Controller (MVC) - View Layer
 * Renders realm selector tabs, difficulty cards, star ratings, and lock states.
 */

import { renderLevelSelectPage, type LevelSelectPageProps } from '../../components/LevelSelectPage';

export class LevelSelectionView {
  public static render(props: LevelSelectPageProps): string {
    return renderLevelSelectPage(props);
  }
}
