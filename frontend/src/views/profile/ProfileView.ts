/**
 * Profile View
 * Model-View-Controller (MVC) - View Layer
 * Renders player profile card, avatar picker, and progress statistics.
 */

import { renderProfileScreen, type ProfileScreenProps } from '../../components/ProfileScreen';

export class ProfileView {
  public static render(props: ProfileScreenProps): string {
    return renderProfileScreen(props);
  }
}
