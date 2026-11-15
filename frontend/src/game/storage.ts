import { LEVELS } from './levels';

const STORAGE_KEY = 'little-tide-save';

export interface SavedGame {
  unlockedThrough: number;
  stars: Record<number, number>;
  muted: boolean;
  pearls: number;
  fishScore: number;
  fishSolved: number;
  pairsWins: number;
  pairsBestMoves: number | null;
  dailyClaimedOn: string | null;
  achievements: string[];
}

export interface LoadedGame {
  game: SavedGame;
  warning?: string;
}

const freshGame = (): SavedGame => ({
  unlockedThrough: 1,
  stars: {},
  muted: false,
  pearls: 0,
  fishScore: 0,
  fishSolved: 0,
  pairsWins: 0,
  pairsBestMoves: null,
  dailyClaimedOn: null,
  achievements: [],
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseSavedGame(value: unknown): SavedGame {
  if (!isRecord(value) || (value.version !== 1 && value.version !== 2)) {
    throw new Error('Saved progress has an unsupported format.');
  }
  if (
    typeof value.unlockedThrough !== 'number' ||
    !Number.isInteger(value.unlockedThrough) ||
    value.unlockedThrough < 1 ||
    value.unlockedThrough > LEVELS.length ||
    typeof value.muted !== 'boolean' ||
    !isRecord(value.stars)
  ) {
    throw new Error('Saved progress is invalid.');
  }

  const stars: Record<number, number> = {};
  for (const [levelId, count] of Object.entries(value.stars)) {
    const parsedLevel = Number(levelId);
    if (
      !Number.isInteger(parsedLevel) ||
      parsedLevel < 1 ||
      parsedLevel > LEVELS.length ||
      typeof count !== 'number' ||
      !Number.isInteger(count) ||
      count < 0 ||
      count > 3
    ) {
      throw new Error('Saved level ratings are invalid.');
    }
    stars[parsedLevel] = count;
  }

  const legacy = value.version === 1;
  const pearls = legacy ? 0 : value.pearls;
  const fishScore = legacy ? 0 : value.fishScore;
  const fishSolved = legacy ? 0 : value.fishSolved;
  const pairsWins = legacy ? 0 : value.pairsWins;
  const pairsBestMoves = legacy ? null : value.pairsBestMoves;
  const dailyClaimedOn = legacy ? null : value.dailyClaimedOn;
  const achievements = legacy ? [] : value.achievements;
  if (
    typeof pearls !== 'number' ||
    !Number.isInteger(pearls) ||
    pearls < 0 ||
    typeof fishScore !== 'number' ||
    !Number.isInteger(fishScore) ||
    fishScore < 0 ||
    typeof fishSolved !== 'number' ||
    !Number.isInteger(fishSolved) ||
    fishSolved < 0 ||
    typeof pairsWins !== 'number' ||
    !Number.isInteger(pairsWins) ||
    pairsWins < 0 ||
    (pairsBestMoves !== null &&
      (typeof pairsBestMoves !== 'number' || !Number.isInteger(pairsBestMoves) || pairsBestMoves < 0)) ||
    (dailyClaimedOn !== null && typeof dailyClaimedOn !== 'string') ||
    !Array.isArray(achievements) ||
    !achievements.every((achievement): achievement is string => typeof achievement === 'string')
  ) {
    throw new Error('Saved rewards or activity are invalid.');
  }

  return {
    unlockedThrough: value.unlockedThrough,
    stars,
    muted: value.muted,
    pearls,
    fishScore,
    fishSolved,
    pairsWins,
    pairsBestMoves,
    dailyClaimedOn,
    achievements,
  };
}

export function loadSavedGame(): LoadedGame {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { game: freshGame() };
    return { game: parseSavedGame(JSON.parse(raw) as unknown) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Storage is unavailable.';
    return { game: freshGame(), warning: `Progress could not be loaded: ${detail}` };
  }
}

export function saveGame(game: SavedGame): { saved: true } | { saved: false; error: string } {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...game, version: 2 }));
    return { saved: true };
  } catch (error) {
    return {
      saved: false,
      error: error instanceof Error ? error.message : 'Storage is unavailable.',
    };
  }
}
