import { describe, expect, it } from 'vitest';
import {
  buildLeaderboard,
  profileFromIdentity,
  profileFromSignUp,
  validateSignIn,
  validateSignUp,
} from '../../src/game/player';

describe('player entry prototype', () => {
  it('validates sign-in fields without claiming to authenticate an account', () => {
    expect(validateSignIn('', 'password')).toContain('Add your email');
    expect(validateSignIn('ocean-player', '')).toContain('Add your email');
    expect(validateSignIn('ocean-player', 'password')).toBeNull();
  });

  it('validates sign-up details and matching passwords', () => {
    expect(validateSignUp('A', 'not-an-email', 'short', 'short')).not.toBeNull();
    expect(validateSignUp('Mira', 'mira@example.com', 'password1', 'password2')).toContain('do not match');
    expect(validateSignUp('Mira', 'mira@example.com', 'oceanpass', 'oceanpass')).toBeNull();
  });

  it('creates profiles from either an email or a player name', () => {
    expect(profileFromIdentity('mira@example.com')).toEqual({ name: 'mira', email: 'mira@example.com' });
    expect(profileFromIdentity('  SeaSprite ')).toEqual({ name: 'SeaSprite', email: null });
    expect(profileFromSignUp(' Mira ', ' mira@example.com ')).toEqual({ name: 'Mira', email: 'mira@example.com' });
  });

  it('ranks the current player and marks their row for highlighting', () => {
    const leaderboard = buildLeaderboard({ name: 'Pearl Keeper', email: null }, 10, 520);
    expect(leaderboard[0].name).toBe('CoralComet');
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[3].name).toBe('Pearl Keeper');
    expect(leaderboard[3].currentPlayer).toBe(true);
    expect(leaderboard[3].rank).toBe(4);
    expect(leaderboard.map((player) => player.rank)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
