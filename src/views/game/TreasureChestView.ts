/**
 * Treasure Chest View
 * Model-View-Controller (MVC) - View Layer
 * Renders the 3-dial combination lock chest modal and clues ledger.
 */

import { renderTreasureChestModal, type TreasureChestModalProps } from '../../components/TreasureChestModal';

export class TreasureChestView {
  public static render(props: TreasureChestModalProps): string {
    return renderTreasureChestModal(props);
  }
}
