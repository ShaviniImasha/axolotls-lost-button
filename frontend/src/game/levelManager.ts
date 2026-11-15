import type { AssetName } from '../assets';
import type { SoundEffect } from '../services/audioService';

export type RealmId = 'pond' | 'coral' | 'cave';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type LevelId = `${RealmId}-${Difficulty}`;
export type HiddenObjectType = 'pearl' | 'shell' | 'starfish' | 'bottle' | 'key' | 'treasure' | 'clue';
export type ObjectPlacement = 'obvious' | 'partly-tucked-away' | 'well-hidden';
export type ChestCodeComplexity = 'direct' | 'encoded' | 'tricky';

export interface ClueDefinition {
  id: string;
  source: 'fish' | 'hidden-object' | 'special-treasure';
  description: string;
  revealedText: string;
  digitIndex: number;
  digitValue: number;
}

export interface RealmDefinition {
  id: RealmId;
  name: string;
  subtitle: string;
  theme: string;
  background: string;
  accentClass: string;
  fishSpecies: [AssetName, AssetName];
  hiddenObjectArtTypes: Record<HiddenObjectType, AssetName>;
  ambientAudio: SoundEffect;
}

export interface DifficultySettings {
  timeLimit: number;
  hiddenObjectCount: number;
  maxHints: number;
  fishPuzzleComplexity: {
    answerOptionCount: 4 | 6 | 10;
    hintEliminationCount: 1 | 2;
  };
  chestCodeComplexity: ChestCodeComplexity;
  requiredCluesCount: number;
  objectPlacement: ObjectPlacement;
  scoreMultiplier: number;
}

export interface AdventureLevelDefinition {
  id: LevelId;
  realmId: RealmId;
  realm: RealmDefinition;
  difficulty: Difficulty;
  difficultySettings: DifficultySettings;
  chestCombination: [number, number, number];
  missionDescription: string;
  clues: ClueDefinition[];
}

export const REALMS: RealmDefinition[] = [
  {
    id: 'pond',
    name: 'Magical Pond',
    subtitle: 'A sunny little pond with suspiciously shiny stuff.',
    theme: 'pond',
    background: 'sunlit pond water',
    accentClass: 'cove',
    fishSpecies: ['fish-peach', 'fish-mint'],
    hiddenObjectArtTypes: {
      pearl: 'pearl',
      shell: 'shell-spiral',
      starfish: 'starfish',
      bottle: 'message-bottle',
      key: 'magic-key',
      treasure: 'pearl',
      clue: 'message-bottle',
    },
    ambientAudio: 'bubble',
  },
  {
    id: 'coral',
    name: 'Coral Garden',
    subtitle: 'Colorful pastel coral formations with inquisitive reef fish.',
    theme: 'garden',
    background: 'pastel coral reef',
    accentClass: 'bay',
    fishSpecies: ['fish-lavender', 'fish-golden'],
    hiddenObjectArtTypes: {
      pearl: 'pearl',
      shell: 'shell-scallop',
      starfish: 'starfish',
      bottle: 'message-bottle',
      key: 'magic-key',
      treasure: 'pearl',
      clue: 'coral-fan',
    },
    ambientAudio: 'found',
  },
  {
    id: 'cave',
    name: 'Enchanted Treasure Cave',
    subtitle: 'A twilight abyss shimmering with glowing crystals and cave dwellers.',
    theme: 'cave',
    background: 'twilight crystal cave',
    accentClass: 'lagoon',
    fishSpecies: ['fish-golden', 'fish-mint'],
    hiddenObjectArtTypes: {
      pearl: 'pearl',
      shell: 'shell-scallop',
      starfish: 'starfish',
      bottle: 'message-bottle',
      key: 'magic-key',
      treasure: 'pearl',
      clue: 'rune-tablet',
    },
    ambientAudio: 'treasure',
  },
];

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    timeLimit: 90,
    hiddenObjectCount: 4,
    maxHints: 3,
    fishPuzzleComplexity: { answerOptionCount: 4, hintEliminationCount: 2 },
    chestCodeComplexity: 'direct',
    requiredCluesCount: 2,
    objectPlacement: 'obvious',
    scoreMultiplier: 1,
  },
  medium: {
    timeLimit: 60,
    hiddenObjectCount: 6,
    maxHints: 2,
    fishPuzzleComplexity: { answerOptionCount: 6, hintEliminationCount: 1 },
    chestCodeComplexity: 'encoded',
    requiredCluesCount: 3,
    objectPlacement: 'partly-tucked-away',
    scoreMultiplier: 1.5,
  },
  hard: {
    timeLimit: 45,
    hiddenObjectCount: 8,
    maxHints: 1,
    fishPuzzleComplexity: { answerOptionCount: 10, hintEliminationCount: 1 },
    chestCodeComplexity: 'tricky',
    requiredCluesCount: 3,
    objectPlacement: 'well-hidden',
    scoreMultiplier: 2,
  },
};

const REALM_ORDER: RealmId[] = ['pond', 'coral', 'cave'];
const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];
const REALM_CODES: Record<RealmId, [number, number, number]> = {
  pond: [3, 5, 2],
  coral: [7, 1, 9],
  cave: [4, 8, 6],
};

export function buildLevelId(realmId: RealmId, difficulty: Difficulty): LevelId {
  return `${realmId}-${difficulty}`;
}

export function parseLevelId(levelId: string): { realmId: RealmId; difficulty: Difficulty } | undefined {
  const match = /^(pond|coral|cave)-(easy|medium|hard)$/.exec(levelId);
  if (!match) return undefined;
  return { realmId: match[1] as RealmId, difficulty: match[2] as Difficulty };
}

function describeClue(
  complexity: ChestCodeComplexity,
  digitIndex: number,
  digitValue: number,
): string {
  const dial = ['first', 'middle', 'last'][digitIndex];
  if (complexity === 'direct') return `${dial} dial: ${digitValue}`;
  if (complexity === 'encoded') {
    const encodedDigit = (digitValue + 3) % 10;
    return `Add 3 to the ${dial} dial and keep the ones digit: ${encodedDigit}.`;
  }
  const encodedDigit = (digitValue * 3) % 10;
  return `Three times the ${dial} dial leaves ${encodedDigit} in the ones place.`;
}

function createLevel(realm: RealmDefinition, difficulty: Difficulty): AdventureLevelDefinition {
  const id = buildLevelId(realm.id, difficulty);
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
  const combination = REALM_CODES[realm.id];
  const clueDefinitions: ClueDefinition[] = ([
    { source: 'fish', description: 'A curious fish shared a chest clue', digitIndex: 0 },
    { source: 'hidden-object', description: 'A hidden keepsake holds a chest clue', digitIndex: 1 },
    { source: 'fish', description: 'A second fish shared a chest clue', digitIndex: 2 },
  ] satisfies Pick<ClueDefinition, 'source' | 'description' | 'digitIndex'>[])
    .slice(0, difficultySettings.requiredCluesCount).map((clue, index) => ({
    id: `${id}-clue-${index + 1}`,
    source: clue.source,
    description: clue.description,
    revealedText:
      difficulty === 'easy' && index === 1
        ? `Second dial: ${combination[1]}. Third dial: ${combination[2]}.`
        : describeClue(difficultySettings.chestCodeComplexity, clue.digitIndex, combination[clue.digitIndex]),
    digitIndex: clue.digitIndex,
    digitValue: combination[clue.digitIndex],
  }));

  return {
    id,
    realmId: realm.id,
    realm,
    difficulty,
    difficultySettings,
    chestCombination: [...combination],
    missionDescription: `Find ${difficultySettings.hiddenObjectCount} shiny things, ask the fish, and crack the chest.`,
    clues: clueDefinitions,
  };
}

export function getLevel(realmId: RealmId, difficulty: Difficulty): AdventureLevelDefinition {
  const realm = REALMS.find((item) => item.id === realmId);
  if (!realm) throw new Error(`Unknown realm: ${realmId}`);
  return createLevel(realm, difficulty);
}

export function getAllLevels(): AdventureLevelDefinition[] {
  return REALM_ORDER.flatMap((realmId) =>
    DIFFICULTY_ORDER.map((difficulty) => getLevel(realmId, difficulty)),
  );
}

export const ADVENTURE_LEVELS = getAllLevels();

export function getRequiredLevelToUnlock(levelId: LevelId): LevelId | null {
  const { realmId, difficulty } = parseLevelId(levelId)!;
  if (difficulty === 'medium') return buildLevelId(realmId, 'easy');
  if (difficulty === 'hard') return buildLevelId(realmId, 'medium');
  const realmIndex = REALM_ORDER.indexOf(realmId);
  return realmIndex === 0 ? null : buildLevelId(REALM_ORDER[realmIndex - 1], 'easy');
}

export function isLevelUnlockedByRules(levelId: LevelId, completedLevels: readonly string[]): boolean {
  const prerequisite = getRequiredLevelToUnlock(levelId);
  return prerequisite === null || completedLevels.includes(prerequisite);
}

export function migrateLegacyLevelIds(levelIds: readonly (string | number)[]): LevelId[] {
  const legacyMapping: Record<number, LevelId> = {
    1: 'pond-easy',
    2: 'coral-medium',
    3: 'cave-hard',
  };
  return Array.from(new Set(levelIds.flatMap((id) => {
    if (typeof id === 'number') return legacyMapping[id] ? [legacyMapping[id]] : [];
    return parseLevelId(id) ? [id as LevelId] : [];
  })));
}

export class LevelManager {
  private currentLevelId: LevelId = 'pond-easy';
  private unlockedLevels: Set<LevelId> = new Set(['pond-easy']);
  private completedLevels: Set<LevelId> = new Set();

  constructor(initialUnlocked: readonly (LevelId | number)[] = ['pond-easy'], initialCompleted: readonly (LevelId | number)[] = []) {
    this.unlockedLevels = new Set(migrateLegacyLevelIds(initialUnlocked));
    if (this.unlockedLevels.size === 0) this.unlockedLevels.add('pond-easy');
    this.completedLevels = new Set(migrateLegacyLevelIds(initialCompleted));
  }

  public getLevels(): AdventureLevelDefinition[] {
    return getAllLevels();
  }

  public getCurrentLevel(): AdventureLevelDefinition {
    return getLevelById(this.currentLevelId)!;
  }

  public getLevelById(id: string): AdventureLevelDefinition | undefined {
    return getLevelById(id);
  }

  public setCurrentLevelId(id: string): boolean {
    const level = getLevelById(id);
    if (level && this.isLevelUnlocked(level.id)) {
      this.currentLevelId = level.id;
      return true;
    }
    return false;
  }

  public isLevelUnlocked(id: string): boolean {
    const parsed = parseLevelId(id);
    return !!parsed && (
      this.unlockedLevels.has(id as LevelId) ||
      isLevelUnlockedByRules(id as LevelId, [...this.completedLevels])
    );
  }

  public isLevelCompleted(id: string): boolean {
    return this.completedLevels.has(id as LevelId);
  }

  public completeCurrentLevel(): { nextLevelUnlocked: boolean; nextLevelId: LevelId | null } {
    this.completedLevels.add(this.currentLevelId);
    const current = this.getCurrentLevel();
    const preferredNext = current.difficulty === 'easy'
      ? buildLevelId(current.realmId, 'medium')
      : current.difficulty === 'medium'
        ? buildLevelId(current.realmId, 'hard')
        : null;
    const newlyUnlocked = getAllLevels().filter(
      (level) => isLevelUnlockedByRules(level.id, [...this.completedLevels]),
    );
    this.unlockedLevels = new Set([...this.unlockedLevels, ...newlyUnlocked.map((level) => level.id)]);
    const nextLevelId =
      preferredNext && this.isLevelUnlocked(preferredNext)
        ? preferredNext
        : newlyUnlocked.find((level) => level.id !== current.id && !this.completedLevels.has(level.id))?.id ?? null;
    return { nextLevelUnlocked: nextLevelId !== null, nextLevelId };
  }

  public getUnlockedLevels(): LevelId[] {
    return getAllLevels()
      .filter((level) => this.isLevelUnlocked(level.id))
      .map((level) => level.id);
  }

  public getCompletedLevels(): LevelId[] {
    return getAllLevels()
      .filter((level) => this.completedLevels.has(level.id))
      .map((level) => level.id);
  }

  public syncProgress(_unlocked: readonly (LevelId | number)[], completed: readonly (LevelId | number)[]): void {
    this.completedLevels = new Set(migrateLegacyLevelIds(completed));
    this.unlockedLevels = new Set([
      'pond-easy',
      ...getAllLevels()
        .filter((level) => isLevelUnlockedByRules(level.id, [...this.completedLevels]))
        .map((level) => level.id),
    ]);
  }
}

export function getLevelById(id: string): AdventureLevelDefinition | undefined {
  const parsed = parseLevelId(id);
  return parsed ? getLevel(parsed.realmId, parsed.difficulty) : undefined;
}
