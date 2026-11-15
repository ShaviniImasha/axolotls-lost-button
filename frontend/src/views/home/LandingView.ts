/**
 * Landing View
 * Model-View-Controller (MVC) - View Layer
 * Renders the introductory title screen with Pip the Axolotl.
 */

import { renderLandingPage } from '../../components/LandingPage';

export class LandingView {
  public static render(): string {
    return renderLandingPage();
  }
}
