/**
 * Pause View
 * Model-View-Controller (MVC) - View Layer
 * Renders the pause menu modal with Resume, Restart, and Level Select actions.
 */

import { renderPauseOverlay, type PauseOverlayProps } from '../../components/PauseOverlay';

export class PauseView {
  public static render(props: PauseOverlayProps): string {
    return renderPauseOverlay(props);
  }
}
