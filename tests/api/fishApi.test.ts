import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFishPuzzle, FISH_API_URL } from '../../src/api/fishApi';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Fish Game API', () => {
  it('uses the documented endpoint and returns the puzzle image and fish answer', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({
        question: 'https://www.sanfoh.com/uob/fish/data/puzzle.png',
        fish: 4,
        chest: 2,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetch);

    await expect(fetchFishPuzzle()).resolves.toEqual({
      imageUrl: 'https://www.sanfoh.com/uob/fish/data/puzzle.png',
      solution: 4,
    });
    expect(fetch).toHaveBeenCalledWith(FISH_API_URL, expect.objectContaining({
      headers: { Accept: 'application/json' },
    }));
  });

  it('rejects invalid puzzle responses without inventing fallback puzzles', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ question: 'not-an-image-url', fish: 4 }),
      { status: 200 },
    )));

    await expect(fetchFishPuzzle()).rejects.toMatchObject({
      kind: 'invalid-response',
    });
  });

  it('reports connection errors clearly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchFishPuzzle()).rejects.toMatchObject({
      kind: 'connection',
    });
  });
});
