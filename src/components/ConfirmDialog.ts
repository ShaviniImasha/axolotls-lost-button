import { assetUrl } from '../assets';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmAction: string;
  cancelAction: string;
}

export function renderConfirmDialog(props: ConfirmDialogProps): string {
  const { title, message, confirmLabel, confirmAction, cancelAction } = props;

  return `
    <div class="game-dim confirm-dim">
      <div class="confirm-dialog-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <img src="${assetUrl('axolotl-sad')}" class="confirm-mascot" alt="Pip asking a question">
        <h2 id="confirm-dialog-title">${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>

        <div class="confirm-actions-row">
          <button class="game-button coral-button" data-action="${confirmAction}">
            ${escapeHtml(confirmLabel)}
          </button>
          <button class="game-button secondary-button" data-action="${cancelAction}">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
