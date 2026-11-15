import { describe, expect, it } from 'vitest';
import { countGoalObjects, discoverObject, OCEAN_AREAS } from '../../src/game/ocean';

describe('underwater object exploration', () => {
  it('keeps the actual phase names aligned with the game flow', () => {
    expect(OCEAN_AREAS[0].name).toBe('Pip’s Puddle');
    expect(OCEAN_AREAS[1].name).toBe('Coral Chaos');
    expect(OCEAN_AREAS[2].name).toBe('Jelly Jumble');

    expect(OCEAN_AREAS[0].subtitle).toContain('sunny little pond');
    expect(OCEAN_AREAS[1].subtitle).toContain('Pretty coral');
    expect(OCEAN_AREAS[2].subtitle).toContain('glowy cave');
  });

  it('counts required finds and completes the first area mission', () => {
    const cove = OCEAN_AREAS[0];
    let found: readonly string[] = [];
    for (const object of cove.objects.filter((item) => item.required)) {
      const discovery = discoverObject(cove, found, object.id);
      expect(discovery.object?.id).toBe(object.id);
      found = discovery.found;
    }

    expect(countGoalObjects(cove, found)).toBe(5);
    expect(discoverObject(cove, found, 'cove-pearl-5').missionComplete).toBe(false);
    expect(discoverObject(cove, [], 'cove-pearl-1').missionComplete).toBe(false);
  });

  it('does not count decoys or duplicate object clicks toward a mission', () => {
    const cove = OCEAN_AREAS[0];
    const decoy = discoverObject(cove, [], 'cove-shell');
    expect(decoy.object?.required).toBe(false);
    expect(decoy.goalFound).toBe(0);
    expect(decoy.missionComplete).toBe(false);

    const duplicate = discoverObject(cove, ['cove-pearl-1'], 'cove-pearl-1');
    expect(duplicate.object).toBeNull();
    expect(duplicate.found).toEqual(['cove-pearl-1']);
    expect(duplicate.goalFound).toBe(1);
  });

  it('has a single required key at the last location', () => {
    const lagoon = OCEAN_AREAS[2];
    const key = lagoon.objects.find((object) => object.type === 'key');
    expect(key?.required).toBe(true);
    if (key) {
      const discovery = discoverObject(lagoon, [], key.id);
      expect(discovery.missionComplete).toBe(true);
      expect(discovery.goalFound).toBe(1);
    }
  });
});
