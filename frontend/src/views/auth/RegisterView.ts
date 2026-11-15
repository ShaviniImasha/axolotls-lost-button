/**
 * Register View
 * Model-View-Controller (MVC) - View Layer
 * Renders the new explorer registration interface.
 */

import { renderRegisterPage, type RegisterPageProps } from '../../components/RegisterPage';

export class RegisterView {
  public static render(props: RegisterPageProps = {}): string {
    return renderRegisterPage(props);
  }
}
