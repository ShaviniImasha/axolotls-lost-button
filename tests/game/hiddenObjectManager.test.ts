import { describe, expect, it } from 'vitest';
import { HiddenObjectManager, LEVEL_OBJECTS } from '../../src/game/hiddenObjectManager';

describe('HiddenObjectManager', () => {
  it('creates difficulty-specific object counts for each realm', () => {
    expect(LEVEL_OBJECTS['pond-easy']).toHaveLength(4);
    expect(LEVEL_OBJECTS['pond-medium']).toHaveLength(6);
    expect(LEVEL_OBJECTS['pond-hard']).toHaveLength(8);
    expect(LEVEL_OBJECTS['coral-easy']).toHaveLength(4);
    expect(LEVEL_OBJECTS['cave-hard']).toHaveLength(8);

    const manager = new HiddenObjectManager('pond-easy');
    expect(manager.getObjectsForCurrentLevel()).toEqual(LEVEL_OBJECTS['pond-easy']);
    expect(manager.getRequiredObjectsCount()).toBe(4);
    expect(manager.getRequiredFoundCount()).toBe(0);
    expect(manager.isMissionComplete()).toBe(false);
  });

  it('keeps positions deterministic for a level and distinct across its difficulties', () => {
    const easy = LEVEL_OBJECTS['pond-easy'].map(({ x, y }) => [x, y]);
    const replay = LEVEL_OBJECTS['pond-easy'].map(({ x, y }) => [x, y]);
    const medium = LEVEL_OBJECTS['pond-medium'].slice(0, 4).map(({ x, y }) => [x, y]);
    expect(replay).toEqual(easy);
    expect(medium).not.toEqual(easy);
  });

  it('awards discoveries once and prevents duplicate rewards', () => {
    const manager = new HiddenObjectManager('pond-easy');
    const firstObject = manager.getObjectsForCurrentLevel()[0];

    const first = manager.discover(firstObject.id);
    expect(first.success).toBe(true);
    expect(first.pointsEarned).toBe(5);
    expect(first.pearlsEarned).toBe(1);
    expect(manager.isObjectFound(firstObject.id)).toBe(true);

    const duplicate = manager.discover(firstObject.id);
    expect(duplicate.success).toBe(false);
    expect(duplicate.pointsEarned).toBe(0);
    expect(duplicate.pearlsEarned).toBe(0);
  });

  it('awards the level-specific clue and detects mission completion', () => {
    const manager = new HiddenObjectManager('pond-easy');
    const clueObject = manager.getObjectsForCurrentLevel().find((object) => object.givesClueId);
    expect(clueObject).toBeDefined();
    const clueResult = manager.discover(clueObject!.id);
    expect(clueResult.clueAwardedId).toBe('pond-easy-clue-2');

    for (const object of manager.getUnfoundObjects()) manager.discover(object.id);
    expect(manager.isMissionComplete()).toBe(true);
  });

  it('clears duplicate-discovery state when changing levels', () => {
    const manager = new HiddenObjectManager('pond-easy');
    const objectId = manager.getObjectsForCurrentLevel()[0].id;
    manager.discover(objectId);
    manager.setLevel('pond-medium');
    manager.setLevel('pond-easy');
    expect(manager.isObjectFound(objectId)).toBe(false);
  });
});
