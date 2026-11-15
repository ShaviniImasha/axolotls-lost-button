import { describe, it, expect, beforeEach } from 'vitest';
import { CookieService } from '../../src/services/cookieService';

describe('CookieService', () => {
  let cookieService: CookieService;
  let simulatedCookieStore: Record<string, string> = {};

  beforeEach(() => {
    cookieService = CookieService.getInstance();
    simulatedCookieStore = {};

    // Mock document.cookie in Node environment
    (globalThis as any).document = {
      get cookie() {
        return Object.entries(simulatedCookieStore)
          .map(([k, v]) => `${k}=${v}`)
          .join('; ');
      },
      set cookie(val: string) {
        const parts = val.split(';');
        const pair = parts[0].trim();
        const eqIdx = pair.indexOf('=');
        if (eqIdx !== -1) {
          const key = pair.substring(0, eqIdx).trim();
          const value = pair.substring(eqIdx + 1).trim();
          if (val.includes('expires=Thu, 01 Jan 1970')) {
            delete simulatedCookieStore[key];
          } else {
            simulatedCookieStore[key] = value;
          }
        }
      },
    };

    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => simulatedCookieStore[k] || null,
        setItem: (k: string, v: string) => {
          simulatedCookieStore[k] = v;
        },
        clear: () => {
          simulatedCookieStore = {};
        },
      },
    };
  });

  it('sets and retrieves cookies properly', () => {
    cookieService.setCookie('test_cookie', 'sparkly_pearl', 7);
    const val = cookieService.getCookie('test_cookie');
    expect(val).toBe('sparkly_pearl');
  });

  it('deletes cookies by expiring them', () => {
    cookieService.setCookie('test_cookie', 'sparkly_pearl', 7);
    expect(cookieService.getCookie('test_cookie')).toBe('sparkly_pearl');
    cookieService.deleteCookie('test_cookie');
    expect(cookieService.getCookie('test_cookie')).toBeNull();
  });

  it('handles consent acceptance and rejection', () => {
    expect(cookieService.getConsent()).toBeNull();
    cookieService.setConsent('accepted');
    expect(cookieService.getConsent()).toBe('accepted');

    cookieService.setConsent('declined');
    expect(cookieService.getConsent()).toBe('declined');
  });
});
