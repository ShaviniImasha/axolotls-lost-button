import type { AssetName } from '../assets';

export type OceanAreaId = 1 | 2 | 3;
export type Findable = 'pearl' | 'shell' | 'key';

export interface HiddenObject {
  id: string;
  type: Findable;
  x: number;
  y: number;
  asset?: AssetName;
  required: boolean;
}

export interface OceanArea {
  id: OceanAreaId;
  name: string;
  subtitle: string;
  mission: string;
  goal: Findable;
  goalCount: number;
  accent: string;
  objects: readonly HiddenObject[];
}

export interface Discovery {
  object: HiddenObject | null;
  found: readonly string[];
  goalFound: number;
  missionComplete: boolean;
}

export const OCEAN_AREAS: readonly OceanArea[] = [
  {
    id: 1,
    name: 'Pip’s Puddle',
    subtitle: 'A sunny little pond with suspiciously shiny stuff.',
    mission: 'Find 5 hidden pearls',
    goal: 'pearl',
    goalCount: 5,
    accent: 'cove',
    objects: [
      { id: 'cove-pearl-1', type: 'pearl', x: 18, y: 58, required: true },
      { id: 'cove-pearl-2', type: 'pearl', x: 38, y: 28, required: true },
      { id: 'cove-pearl-3', type: 'pearl', x: 55, y: 67, required: true },
      { id: 'cove-pearl-4', type: 'pearl', x: 76, y: 43, required: true },
      { id: 'cove-pearl-5', type: 'pearl', x: 88, y: 75, required: true },
      { id: 'cove-shell', type: 'shell', asset: 'shell-spiral', x: 28, y: 82, required: false },
      { id: 'cove-starfish', type: 'shell', asset: 'starfish', x: 67, y: 31, required: false },
    ],
  },
  {
    id: 2,
    name: 'Coral Chaos',
    subtitle: 'Pretty coral. Busy fish. Zero personal space.',
    mission: 'Find 3 moon shells before the reef gets louder',
    goal: 'shell',
    goalCount: 3,
    accent: 'bay',
    objects: [
      { id: 'bay-shell-1', type: 'shell', asset: 'shell-scallop', x: 22, y: 68, required: true },
      { id: 'bay-shell-2', type: 'shell', asset: 'shell-spiral', x: 51, y: 40, required: true },
      { id: 'bay-shell-3', type: 'shell', asset: 'shell-scallop', x: 81, y: 73, required: true },
      { id: 'bay-pearl', type: 'pearl', x: 38, y: 82, required: false },
      { id: 'bay-starfish', type: 'shell', asset: 'starfish', x: 70, y: 28, required: false },
    ],
  },
  {
    id: 3,
    name: 'Jelly Jumble',
    subtitle: 'A glowy cave. Wobbly jellies. One stubborn chest.',
    mission: 'Find the hidden key and unlock the glowing chest',
    goal: 'key',
    goalCount: 1,
    accent: 'lagoon',
    objects: [
      { id: 'lagoon-key', type: 'key', x: 72, y: 55, required: true },
      { id: 'lagoon-pearl-1', type: 'pearl', x: 28, y: 41, required: false },
      { id: 'lagoon-pearl-2', type: 'pearl', x: 84, y: 28, required: false },
      { id: 'lagoon-shell', type: 'shell', asset: 'shell-scallop', x: 46, y: 76, required: false },
      { id: 'lagoon-starfish', type: 'shell', asset: 'starfish', x: 17, y: 73, required: false },
    ],
  },
];

export function discoverObject(
  area: OceanArea,
  found: readonly string[],
  objectId: string,
): Discovery {
  const object = area.objects.find((candidate) => candidate.id === objectId);
  if (!object || found.includes(objectId)) {
    return {
      object: null,
      found,
      goalFound: countGoalObjects(area, found),
      missionComplete: false,
    };
  }

  const nextFound = [...found, objectId];
  const goalFound = countGoalObjects(area, nextFound);
  return {
    object,
    found: nextFound,
    goalFound,
    missionComplete: goalFound >= area.goalCount,
  };
}

export function countGoalObjects(area: OceanArea, found: readonly string[]): number {
  return found.filter((id) => {
    const object = area.objects.find((candidate) => candidate.id === id);
    return object?.required === true && object.type === area.goal;
  }).length;
}
