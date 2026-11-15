import { describe, expect, it } from 'vitest';
import { DIFFICULTY_MULTIPLIERS, ScoringSystem, SCORE_VALUES } from '../../src/game/scoringSystem';

describe('ScoringSystem', () => {
  it('initializes with 0 or provided score and enforces minimum 0', () => {
    const system = new ScoringSystem(0);
    expect(system.getScore()).toBe(0);

    const negativeSystem = new ScoringSystem(-10);
    expect(negativeSystem.getScore()).toBe(0);

    const scoredSystem = new ScoringSystem(50);
    expect(scoredSystem.getScore()).toBe(50);
  });

  it('correctly applies scoring rules per specification', () => {
    const system = new ScoringSystem(0);

    // Fish correct: +10
    expect(SCORE_VALUES['fish-correct']).toBe(10);
    const r1 = system.applyAction('fish-correct');
    expect(r1.newScore).toBe(10);

    // Fish incorrect: -5
    expect(SCORE_VALUES['fish-incorrect']).toBe(-5);
    const r2 = system.applyAction('fish-incorrect');
    expect(r2.newScore).toBe(5);

    // Normal hidden object: +5
    expect(SCORE_VALUES['find-normal']).toBe(5);
    const r3 = system.applyAction('find-normal');
    expect(r3.newScore).toBe(10);

    // Special treasure: +10
    expect(SCORE_VALUES['find-treasure']).toBe(10);
    const r4 = system.applyAction('find-treasure');
    expect(r4.newScore).toBe(20);

    // Level complete: +30
    expect(SCORE_VALUES['level-complete']).toBe(30);
    const r5 = system.applyAction('level-complete');
    expect(r5.newScore).toBe(50);
  });

  it('never allows score to drop below zero', () => {
    const system = new ScoringSystem(2);
    const result = system.applyAction('fish-incorrect');
    expect(result.newScore).toBe(0);
    expect(system.getScore()).toBe(0);
  });

  it('applies the optional difficulty multiplier only to the final score', () => {
    expect(DIFFICULTY_MULTIPLIERS).toEqual({ easy: 1, medium: 1.5, hard: 2 });
    const medium = new ScoringSystem(20);
    medium.applyAction('level-complete');
    expect(medium.finalizeScore('medium')).toBe(75);

    const hard = new ScoringSystem(20);
    hard.applyAction('level-complete');
    expect(hard.finalizeScore('hard')).toBe(100);

    const disabled = new ScoringSystem(20);
    disabled.applyAction('level-complete');
    expect(disabled.finalizeScore('hard', false)).toBe(50);
  });
});
