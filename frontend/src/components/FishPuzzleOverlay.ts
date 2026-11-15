import { assetUrl } from '../assets';
import type { PuzzleState } from '../game/puzzleManager';
import { ArrowRight, CircleCheck, CircleX, RotateCw } from 'lucide';
import { lucideIcon } from './lucideIcon';

export interface FishPuzzleOverlayProps {
  puzzle: PuzzleState;
  score: number;
  clueAwardedText?: string | null;
}

export function renderFishPuzzleOverlay(props: FishPuzzleOverlayProps): string {
  const { puzzle, score, clueAwardedText } = props;

  let bodyHtml = '';

  if (puzzle.loading) {
    bodyHtml = `
      <div class="fish-loading-state">
        <div class="fish-loader-spinner"></div>
        <img src="${assetUrl('axolotl-mascot')}" class="fish-loading-axo" alt="Pip waiting">
        <strong>Finding a fish with a riddle...</strong>
        <small>Pip is warming up their counting fins.</small>
      </div>
    `;
  } else if (puzzle.error || !puzzle.current) {
    bodyHtml = `
      <div class="fish-error-state">
        <img src="${assetUrl('axolotl-sad')}" class="fish-loading-axo" alt="Pip looking puzzled">
        <strong>That fish swam off.</strong>
        <small>${escapeHtml(puzzle.error || 'No riddle right now. Give it another try.')}</small>
        <button class="game-button coral-button" data-action="retry-fish-fetch">
          <span>TRY AGAIN</span>
          ${lucideIcon(RotateCw, 'hud-icon')}
        </button>
      </div>
    `;
  } else {
    // We have a live puzzle
    const digits = puzzle.answerOptions;

    bodyHtml = `
      <div class="fish-puzzle-content">
        <div class="api-puzzle-side">
          <div class="api-image-frame">
            <img src="${puzzle.current.imageUrl}" alt="Live Fish API Riddle Question" class="api-puzzle-image">
          </div>
        </div>

        <div class="fish-answer-side">
          <div class="fish-overlay-top">
            <span class="chapter-mark">FISHY MATH</span>
            <h2>Can you crack it?</h2>
            <p>Count the treasures, solve the riddle, then tap your number (0–9)!</p>
          </div>

          <div class="fish-answer-grid" aria-label="Select a digit from 0 to 9">
            ${digits
              .map((d) => {
                const isSelected = puzzle.selectedAnswer === d;
                const isEliminated = puzzle.eliminatedOptions.includes(d);
                const disabled = puzzle.submitted || isEliminated;

                return `
                  <button class="fish-answer-btn ${isSelected ? 'chosen' : ''} ${isEliminated ? 'eliminated' : ''}"
                    data-action="select-fish-answer"
                    data-value="${d}"
                    ${disabled ? 'disabled' : ''}
                    title="${isEliminated ? 'Eliminated by hint' : `Select ${d}`}">
                    ${d}
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="fish-puzzle-tools">
            <button class="tool-btn cute-hint-pill" data-action="use-fish-hint" ${puzzle.hintUsed || puzzle.submitted ? 'disabled' : ''}>
              <img src="${assetUrl('icon-hint')}" alt="" class="mini-icon">
              <span>${puzzle.hintUsed ? 'Clue Used' : 'Ask Pip for a Hint!'}</span>
            </button>
          </div>

          <!-- Feedback notification -->
          ${
            puzzle.feedback === 'correct'
              ? `
                <div class="fish-celebration-bubble is-correct" role="status">
                  <div class="feedback-mascot-wrap">
                    <img src="${assetUrl('axolotl-excited')}" class="feedback-pip-mascot" alt="Pip excited">
                  </div>
                  <div class="feedback-copy">
                    <span class="feedback-pill-badge">YAY, YOU GOT IT!</span>
                    <strong class="feedback-highlight">+10 Score</strong>
                    <p>${clueAwardedText || 'Pip unlocked a chest clue!'}</p>
                  </div>
                </div>
                <button class="game-button coral-button next-fish" data-action="close-fish-puzzle">
                  <span>BACK TO THE POND</span>
                  <span>→</span>
                </button>
              `
              : puzzle.feedback === 'incorrect'
                ? `
                  <div class="fish-celebration-bubble is-wrong" role="alert">
                    <div class="feedback-mascot-wrap">
                      <img src="${assetUrl('axolotl-surprised')}" class="feedback-pip-mascot" alt="Pip surprised">
                    </div>
                    <div class="feedback-copy">
                      <span class="feedback-pill-badge oops-badge">OOPSIE, ALMOST!</span>
                      <strong class="feedback-highlight">Pip says take another look!</strong>
                      <p>Count the treasures and try again!</p>
                    </div>
                  </div>
                  <div class="fish-wrong-actions">
                    <button class="game-button coral-button" data-action="retry-fish-answer">
                      TRY AGAIN ↺
                    </button>
                    <button class="back-link-btn" data-action="close-fish-puzzle">
                      Back to pond
                    </button>
                  </div>
                `
                : `
                  <button class="game-button coral-button submit-fish-btn" data-action="submit-fish-answer" ${puzzle.selectedAnswer === null ? 'disabled' : ''}>
                    <span>SUBMIT ANSWER</span>
                    ${lucideIcon(CircleCheck, 'hud-icon')}
                  </button>
                `
          }
        </div>
      </div>
    `;
  }

  return `
    <div class="game-dim">
      <section class="fish-overlay" role="dialog" aria-modal="true" aria-labelledby="fish-modal-title">
        <div class="overlay-topline">
          <span class="fish-quiz-kicker">PIP’S FISHY QUIZ</span>
          <button data-action="close-fish-puzzle" class="close-overlay-btn" title="Close" aria-label="Close dialog">X</button>
        </div>

        <div class="fish-overlay-heading">
          <div>
            <span class="chapter-mark">AXOLOTL’S LOST BUTTON</span>
            <h1 id="fish-modal-title">Fishy brain time</h1>
          </div>
          <div class="fish-overlay-score">
            <img src="${assetUrl('star-gold')}" alt="" class="mini-icon">
            <strong>${score}</strong> <small>SCORE</small>
          </div>
        </div>

        ${bodyHtml}
      </section>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
