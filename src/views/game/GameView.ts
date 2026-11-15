/**
 * Game View
 * Model-View-Controller (MVC) - View Layer
 * Renders the main exploration screen container.
 */

import { renderExplorationScreen, type ExplorationScreenProps } from '../../components/ExplorationScreen';

export class GameView {
  public static render(props: ExplorationScreenProps): string {
    return renderExplorationScreen(props);
  }
}
