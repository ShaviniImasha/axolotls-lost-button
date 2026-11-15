/**
 * Home View
 * Model-View-Controller (MVC) - View Layer
 * Renders the main player hub, Pip interactions, realm quick-jump, and active stats.
 */

import { renderHomePage, type HomePageProps } from '../../components/HomePage';

export class HomeView {
  public static render(props: HomePageProps): string {
    return renderHomePage(props);
  }
}
