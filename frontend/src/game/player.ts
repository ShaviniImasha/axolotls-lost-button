import type { AssetName } from '../assets';

const REMEMBERED_IDENTITY_KEY = 'aqua-pals-remembered-player';

export interface PlayerProfile {
  name: string;
  email: string | null;
}

export interface LeaderboardPlayer {
  name: string;
  avatar: AssetName;
  score: number;
  pearls: number;
  currentPlayer: boolean;
}

export interface RankedPlayer extends LeaderboardPlayer {
  rank: number;
}

const SAMPLE_PLAYERS: readonly LeaderboardPlayer[] = [
  { name: 'CoralComet', avatar: 'fish-peach', score: 2480, pearls: 31, currentPlayer: false },
  { name: 'Bubbles', avatar: 'axolotl-excited', score: 2160, pearls: 27, currentPlayer: false },
  { name: 'PearlSprout', avatar: 'fish-mint', score: 1840, pearls: 22, currentPlayer: false },
  { name: 'Moonfin', avatar: 'fish-lavender', score: 1510, pearls: 18, currentPlayer: false },
  { name: 'KelpScout', avatar: 'jellyfish', score: 1260, pearls: 14, currentPlayer: false },
];

export function validateSignIn(identity: string, password: string): string | null {
  if (!identity.trim() || !password) return 'Add your email or player name and password to dive in.';
  return null;
}

export function validateSignUp(
  name: string,
  email: string,
  password: string,
  confirmation: string,
): string | null {
  if (name.trim().length < 2) return 'Your player name needs at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Add a valid email address.';
  if (password.length < 8) return 'Choose a password with at least 8 characters.';
  if (password !== confirmation) return 'Those passwords do not match yet.';
  return null;
}

export function profileFromIdentity(identity: string): PlayerProfile {
  const trimmed = identity.trim();
  const name = trimmed.includes('@') ? trimmed.slice(0, trimmed.indexOf('@')) : trimmed;
  return { name: name || 'Ocean Explorer', email: trimmed.includes('@') ? trimmed : null };
}

export function profileFromSignUp(name: string, email: string): PlayerProfile {
  return { name: name.trim(), email: email.trim() };
}

export function readRememberedIdentity(): { identity: string | null; warning?: string } {
  try {
    return { identity: window.localStorage.getItem(REMEMBERED_IDENTITY_KEY) };
  } catch (error) {
    return {
      identity: null,
      warning: error instanceof Error ? `Remember me is unavailable: ${error.message}` : 'Remember me is unavailable.',
    };
  }
}

export function rememberIdentity(identity: string | null): { saved: true } | { saved: false; error: string } {
  try {
    if (identity) window.localStorage.setItem(REMEMBERED_IDENTITY_KEY, identity);
    else window.localStorage.removeItem(REMEMBERED_IDENTITY_KEY);
    return { saved: true };
  } catch (error) {
    return {
      saved: false,
      error: error instanceof Error ? error.message : 'Browser storage is unavailable.',
    };
  }
}

export function buildLeaderboard(
  current: PlayerProfile,
  pearls: number,
  fishScore: number,
): RankedPlayer[] {
  const players: LeaderboardPlayer[] = [
    ...SAMPLE_PLAYERS,
    {
      name: current.name,
      avatar: 'axolotl-happy',
      score: pearls * 100 + fishScore,
      pearls,
      currentPlayer: true,
    },
  ];
  return players
    .sort((first, second) => second.score - first.score || first.name.localeCompare(second.name))
    .map((player, index) => ({ ...player, rank: index + 1 }));
}
