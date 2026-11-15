/**
 * Navigation View
 * Model-View-Controller (MVC) - View Layer
 * Renders the shared top navigation bar across all screens.
 */

import { renderSharedNav, type SharedNavProps } from '../../components/sharedNav';

export class NavigationView {
  public static render(props: SharedNavProps = {}): string {
    return renderSharedNav(props);
  }
}
