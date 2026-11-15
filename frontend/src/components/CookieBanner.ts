export class CookieBanner {
  
  public static render(): string {
    return `
      <div id="cookie-banner" class="cookie-banner-wrap" role="region" aria-label="Cookie Preferences">
        <div class="cookie-banner-content">
          <div class="cookie-mascot-pill">
            <span class="cookie-icon-sparkle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </span>
          </div>
          <div class="cookie-text-area">
            <h4 class="cookie-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
              </svg>
              Underwater Cookies & Data
            </h4>
            <p class="cookie-desc">
              Pip uses essential cookies to remember your logged-in session, sound settings, and deep-sea progress! 
              We never track you across outside reefs.
            </p>
          </div>
          <div class="cookie-btn-group">
            <button id="btn-cookie-decline" class="cookie-btn btn-cookie-secondary" data-action="decline-cookies" title="Essential Only">
              Essential Only
            </button>
            <button id="btn-cookie-accept" class="cookie-btn btn-cookie-primary" data-action="accept-cookies" title="Accept All">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              Accept All
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
