import { assetUrl } from '../assets';

export function createStarRating(earned: number, total = 3, size = 48): HTMLDivElement {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.gap = '4px';
  row.setAttribute('role', 'img');
  row.setAttribute('aria-label', `${earned} of ${total} stars`);

  for (let i = 0; i < total; i++) {
    const star = new Image(size, size);
    star.src = assetUrl(i < earned ? 'star-gold' : 'star-empty');
    star.alt = '';
    row.append(star);
  }
  return row;
}

