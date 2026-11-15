export type CookieConsent = 'accepted' | 'declined' | null;

export class CookieService {
  private static instance: CookieService;

  private constructor() {}

  public static getInstance(): CookieService {
    if (!CookieService.instance) {
      CookieService.instance = new CookieService();
    }
    return CookieService.instance;
  }

  /**
   * Sets a cookie in the browser document.
   */
  public setCookie(name: string, value: string, days: number = 365, sameSite: string = 'Lax'): void {
    if (typeof document === 'undefined') return;

    let expires = '';
    if (days > 0) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/; SameSite=${sameSite}${secure}`;
  }

  /**
   * Retrieves a cookie value by name.
   */
  public getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const targetName = encodeURIComponent(name) + '=';
    const parts = document.cookie.split(';');

    for (let part of parts) {
      part = part.trim();
      if (part.indexOf(targetName) === 0) {
        return decodeURIComponent(part.substring(targetName.length));
      }
    }
    return null;
  }

  /**
   * Deletes a cookie by expiring it immediately.
   */
  public deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Checks if user has already granted or declined cookie consent.
   */
  public getConsent(): CookieConsent {
    const cookieVal = this.getCookie('axolotl_cookie_consent');
    if (cookieVal === 'accepted' || cookieVal === 'declined') {
      return cookieVal;
    }

    // Fallback to localStorage if cookies disabled/blocked
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const local = window.localStorage.getItem('axolotl_cookie_consent');
        if (local === 'accepted' || local === 'declined') {
          return local;
        }
      } catch {
        // ignore
      }
    }

    return null;
  }

  /**
   * Saves user's cookie consent choice.
   */
  public setConsent(consent: 'accepted' | 'declined'): void {
    this.setCookie('axolotl_cookie_consent', consent, 365);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('axolotl_cookie_consent', consent);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Helper to store session preferences when consent is given.
   */
  public setPreference(key: string, value: string): void {
    const consent = this.getConsent();
    if (consent === 'accepted') {
      this.setCookie(`pref_${key}`, value, 180);
    }
  }

  public getPreference(key: string): string | null {
    return this.getCookie(`pref_${key}`);
  }
}

export const cookieService = CookieService.getInstance();

