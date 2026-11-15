/**
 * Puzzle View
 * Model-View-Controller (MVC) - View Layer
 * Renders the Fish API math riddle modal, option choices, and feedback sparkles.
 */

import { renderFishPuzzleOverlay, type FishPuzzleOverlayProps } from '../../components/FishPuzzleOverlay';

export class PuzzleView {
  public static render(props: FishPuzzleOverlayProps): string {
    return renderFishPuzzleOverlay(props);
  }
}
