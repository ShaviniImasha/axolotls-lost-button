import { assetUrl } from '../assets';

export function renderLandingPage(): string {
  return `
    <main class="start-screen">
      <div class="start-water"></div>
      <div class="start-rays"></div>
      <span class="start-bubble start-bubble-a"></span>
      <span class="start-bubble start-bubble-b"></span>
      <span class="start-bubble start-bubble-c"></span>

      <div class="start-coral start-coral-left">
        <img src="${assetUrl('coral-fan')}" alt="Coral">
        <img src="${assetUrl('seaweed-wave')}" alt="Seaweed">
        <img src="${assetUrl('coral-round')}" alt="Coral">
      </div>
      <div class="start-coral start-coral-right">
        <img src="${assetUrl('seaweed-leafy')}" alt="Seaweed">
        <img src="${assetUrl('coral-branch')}" alt="Coral">
        <img src="${assetUrl('shell-scallop')}" alt="Shell">
      </div>

      <div class="start-composition">
        <div class="start-copy">
          <span class="game-overline">✦ A TINY UNDERWATER QUEST ✦</span>
          <h1>Axolotl’s</h1>
          <h2>Lost Button</h2>
          <p class="start-story">
            Pip lost a button. Classic Pip. Help this tiny pond detective find it, solve fishy riddles, and open the chest.
          </p>
          <div class="start-cta-group">
            <button class="play-button" data-action="go-login">
              <span class="play-gem"><img src="${assetUrl('icon-play')}" alt="Play"></span>
              <span>LET’S DIVE IN</span>
              <span class="play-arrow">→</span>
            </button>
            <button class="start-sign-up" data-action="go-register">
              NEW HERE? <strong>CREATE ACCOUNT</strong>
            </button>
          </div>
          <span class="saved-note">
            <img src="${assetUrl('axolotl-happy')}" alt="Pip the axolotl">
            Fish riddles, shiny loot, and one very forgetful axolotl.
          </span>
        </div>

        <div class="start-mascot-stage">
          <div class="start-moon"></div>
          <img src="${assetUrl('axolotl-excited')}" class="start-mascot pulse-bob" alt="Pip, ready to explore">
          <span class="start-sticker">PIP’S<br><strong>BUTTON!</strong></span>
          <span class="start-orb start-orb-one"><img src="${assetUrl('fish-mint')}" alt="Fish friend"></span>
          <span class="start-orb start-orb-two"><img src="${assetUrl('star-gold')}" alt="Star"></span>
          <img src="${assetUrl('bubbles')}" class="start-bubbles" alt="Bubbles">
        </div>
      </div>

      <div class="start-footer">
        <span>FIND SHINY THINGS · HELP FISH · RESCUE PIP’S BUTTON</span>
      </div>
    </main>
  `;
}
