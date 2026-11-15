/**
 * Login View
 * Model-View-Controller (MVC) - View Layer
 * Renders the player sign-in and password reset UI.
 */

import { renderLoginPage, type LoginPageProps } from '../../components/LoginPage';

export interface LoginViewModelProps extends LoginPageProps {
  onSignIn?: (credentials: { email: string; password?: string }) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: (email: string) => void;
}

export class LoginView {
  public static render(props: LoginPageProps = {}): string {
    return renderLoginPage(props);
  }
}
