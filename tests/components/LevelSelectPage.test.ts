import { describe, expect, it } from 'vitest';
import { renderLevelSelectPage } from '../../src/components/LevelSelectPage';

describe('pond selection page', () => {
  it('shows three ponds with Easy, Medium, and Hard options for each', () => {
    const html = renderLevelSelectPage({
      unlockedLevels: ['pond-easy'],
      completedLevels: [],
    });

    expect(html.match(/class="pond-selection-card"/g)).toHaveLength(3);
    for (const levelId of [
      'pond-easy', 'pond-medium', 'pond-hard',
      'coral-easy', 'coral-medium', 'coral-hard',
      'cave-easy', 'cave-medium', 'cave-hard',
    ]) {
      expect(html).toContain(`data-level-id="${levelId}"`);
    }
    expect(html.match(/class="level-diff badge-easy"/g)).toHaveLength(3);
    expect(html.match(/class="level-diff badge-medium"/g)).toHaveLength(3);
    expect(html.match(/class="level-diff badge-hard"/g)).toHaveLength(3);
  });

  it('preserves locked and completed status per difficulty', () => {
    const html = renderLevelSelectPage({
      unlockedLevels: ['pond-easy', 'pond-medium'],
      completedLevels: ['pond-easy'],
      bestScores: { 'pond-easy': 1200 },
    });

    expect(html).toContain('PLAY AGAIN');
    expect(html).toContain('BEST 1200');
    expect(html).toContain('data-level-id="pond-medium"');
    expect(html).toContain('aria-label="Hard locked"');
    expect(html).toContain('data-level-id="pond-hard" disabled');
  });
});
