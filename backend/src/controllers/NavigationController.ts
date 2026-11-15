/**
 * Navigation Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates screen transitions and view routing across the game.
 */

export type AppScreen =
  | 'landing'
  | 'login'
  | 'register'
  | 'home'
  | 'level-select'
  | 'game'
  | 'leaderboard'
  | 'profile';

export class NavigationController {
  private static instance: NavigationController;
  private currentScreen: AppScreen = 'landing';
  private navigationListeners: Array<(screen: AppScreen, params?: Record<string, unknown>) => void> = [];

  private constructor() {}

  public static getInstance(): NavigationController {
    if (!NavigationController.instance) {
      NavigationController.instance = new NavigationController();
    }
    return NavigationController.instance;
  }

  public getCurrentScreen(): AppScreen {
    return this.currentScreen;
  }

  public navigateTo(screen: AppScreen, params?: Record<string, unknown>): void {
    this.currentScreen = screen;
    for (const listener of this.navigationListeners) {
      listener(screen, params);
    }
  }

  public onNavigate(listener: (screen: AppScreen, params?: Record<string, unknown>) => void): () => void {
    this.navigationListeners.push(listener);
    return () => {
      this.navigationListeners = this.navigationListeners.filter((l) => l !== listener);
    };
  }
}

export const navigationController = NavigationController.getInstance();
