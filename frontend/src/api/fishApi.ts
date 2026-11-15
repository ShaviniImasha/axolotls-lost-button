export const FISH_API_URL = 'https://marcconrad.com/uob/fish/api.php?out=json&base64=yes';

export interface FishPuzzle { imageUrl: string; solution: number; }
export type FishApiErrorKind = 'connection' | 'invalid-response';

export class FishApiError extends Error {
  constructor(message: string, readonly kind: FishApiErrorKind) {
    super(message);
    this.name = 'FishApiError';
  }
}

function parsePuzzle(payload: unknown): FishPuzzle {
  if (!payload || typeof payload !== 'object') throw new FishApiError('The puzzle service returned an unexpected response.', 'invalid-response');
  const value = payload as Record<string, unknown>;
  const question = value.question;
  const solution = value.fish ?? value.solution;
  if (typeof question !== 'string' || !Number.isInteger(solution) || Number(solution) < 0 || Number(solution) > 9) {
    throw new FishApiError('The puzzle service returned an incomplete puzzle.', 'invalid-response');
  }
  if (question.startsWith('data:image/')) return { imageUrl: question, solution: Number(solution) };
  if (/^[A-Za-z0-9+/]+=*$/.test(question) && question.length > 100) {
    return { imageUrl: `data:image/png;base64,${question}`, solution: Number(solution) };
  }
  let image: URL;
  try { image = new URL(question); } catch { throw new FishApiError('The puzzle image address is invalid.', 'invalid-response'); }
  if (image.protocol !== 'https:') throw new FishApiError('The puzzle image must use a secure address.', 'invalid-response');
  return { imageUrl: image.href, solution: Number(solution) };
}

export async function fetchFishPuzzle(signal?: AbortSignal): Promise<FishPuzzle> {
  let response: Response;
  try { response = await fetch(FISH_API_URL, { headers: { Accept: 'application/json' }, signal }); }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new FishApiError('Could not connect to the Fish Puzzle service.', 'connection');
  }
  if (!response.ok) throw new FishApiError(`The puzzle service responded with ${response.status}.`, 'connection');
  try { return parsePuzzle(await response.json()); }
  catch (error) { if (error instanceof FishApiError) throw error; throw new FishApiError('The puzzle service returned unreadable data.', 'invalid-response'); }
}

export function preloadPuzzleImage(imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new FishApiError('The puzzle image could not be loaded.', 'connection'));
    image.src = imageUrl;
  });
}
