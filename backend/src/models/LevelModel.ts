import { ADVENTURE_LEVELS, type AdventureLevelDefinition, type LevelId } from '../../../frontend/src/game/levelManager';

export const LevelModel = {
  getAll(): AdventureLevelDefinition[] { return ADVENTURE_LEVELS; },
  getById(id: LevelId): AdventureLevelDefinition | undefined { return ADVENTURE_LEVELS.find((level) => level.id === id); },
};
