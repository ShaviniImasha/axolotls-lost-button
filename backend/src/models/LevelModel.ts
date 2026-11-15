/**
 * Level Model
 * Backend MVC - Model Layer
 */

export interface LevelDefinition {
  id: string;
  realmId: 'pond' | 'coral' | 'cave';
  realmName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  chestCombination: [number, number, number];
  missionDescription: string;
  requiredCluesCount: number;
  scoreMultiplier: number;
}

export const BACKEND_LEVELS: LevelDefinition[] = [
  { id: 'pond-easy', realmId: 'pond', realmName: 'Magical Pond', difficulty: 'easy', timeLimit: 90, chestCombination: [3, 5, 2], missionDescription: 'Find Pip’s hidden keys and unlock the pond vault!', requiredCluesCount: 2, scoreMultiplier: 1 },
  { id: 'pond-medium', realmId: 'pond', realmName: 'Magical Pond', difficulty: 'medium', timeLimit: 60, chestCombination: [3, 5, 2], missionDescription: 'Watch the currents and solve the encoded dials!', requiredCluesCount: 3, scoreMultiplier: 1.5 },
  { id: 'pond-hard', realmId: 'pond', realmName: 'Magical Pond', difficulty: 'hard', timeLimit: 45, chestCombination: [3, 5, 2], missionDescription: 'Master the tricky multiplication riddles before the clock runs out!', requiredCluesCount: 3, scoreMultiplier: 2 },
  { id: 'coral-easy', realmId: 'coral', realmName: 'Mossy Pond', difficulty: 'easy', timeLimit: 90, chestCombination: [7, 1, 9], missionDescription: 'Search among the soft coral fans for shiny button pieces!', requiredCluesCount: 2, scoreMultiplier: 1 },
  { id: 'coral-medium', realmId: 'coral', realmName: 'Mossy Pond', difficulty: 'medium', timeLimit: 60, chestCombination: [7, 1, 9], missionDescription: 'Decode the coral secrets with quick fins!', requiredCluesCount: 3, scoreMultiplier: 1.5 },
  { id: 'coral-hard', realmId: 'coral', realmName: 'Mossy Pond', difficulty: 'hard', timeLimit: 45, chestCombination: [7, 1, 9], missionDescription: 'Crack the ancient coral cryptogram with Pip!', requiredCluesCount: 3, scoreMultiplier: 2 },
  { id: 'cave-easy', realmId: 'cave', realmName: 'Moonlit Pond', difficulty: 'easy', timeLimit: 90, chestCombination: [4, 8, 6], missionDescription: 'Follow the gentle glow of deep cavern pearls!', requiredCluesCount: 2, scoreMultiplier: 1 },
  { id: 'cave-medium', realmId: 'cave', realmName: 'Moonlit Pond', difficulty: 'medium', timeLimit: 60, chestCombination: [4, 8, 6], missionDescription: 'Solve the moonlit dials under twilight waters!', requiredCluesCount: 3, scoreMultiplier: 1.5 },
  { id: 'cave-hard', realmId: 'cave', realmName: 'Moonlit Pond', difficulty: 'hard', timeLimit: 45, chestCombination: [4, 8, 6], missionDescription: 'Master the deepest vault of the Moonlit Pond!', requiredCluesCount: 3, scoreMultiplier: 2 },
];

export class LevelModel {
  public static getAll(): LevelDefinition[] {
    return [...BACKEND_LEVELS];
  }

  public static getById(id: string): LevelDefinition | undefined {
    return BACKEND_LEVELS.find((l) => l.id === id);
  }

  public static getByRealm(realmId: string): LevelDefinition[] {
    return BACKEND_LEVELS.filter((l) => l.realmId === realmId);
  }
}
