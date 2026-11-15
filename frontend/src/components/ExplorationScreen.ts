import { assetUrl } from '../assets';
import type { AssetName } from '../assets';
import type { AdventureLevelDefinition } from '../game/levelManager';
import type { LevelHiddenObject } from '../game/hiddenObjectManager';
import { lucideIcon } from './lucideIcon';
import {
  ArrowUpRight,
  CircleCheck,
  House,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  LockKeyholeOpen,
  Pause,
  Search,
  Star,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide';

const HIDDEN_OBJECT_ASSETS: Partial<Record<LevelHiddenObject['type'], AssetName>> = {
  pearl: 'pearl',
  bottle: 'message-bottle',
  key: 'magic-key',
  clue: 'rune-tablet',
  treasure: 'pearl',
};

export interface ExplorationScreenProps {
  level: AdventureLevelDefinition;
  score: number;
  pearls: number;
  timeRemainingStr: string;
  timeFraction: number;
  hintsRemaining: number;
  unfoundObjects: LevelHiddenObject[];
  foundObjectIds: string[];
  collectedClues: string[];
  requiredFoundCount: number;
  totalRequiredCount: number;
  isMissionComplete: boolean;
  soundMuted: boolean;
  highlightedCoords?: { x: number; y: number } | null;
  axoSpeech?: string;
  isChestUnlocked?: boolean;
}

export function renderExplorationScreen(props: ExplorationScreenProps): string {
  const {
    level,
    score,
    pearls,
    timeRemainingStr,
    timeFraction,
    hintsRemaining,
    unfoundObjects,
    collectedClues,
    requiredFoundCount,
    totalRequiredCount,
    isMissionComplete,
    soundMuted,
    highlightedCoords,
    axoSpeech = 'Psst... look for a glimmer!',
    isChestUnlocked = false,
  } = props;

  const missionPercent = totalRequiredCount > 0 ? (requiredFoundCount / totalRequiredCount) * 100 : 0;
  const { realm, difficultySettings } = level;
  const realmId = level.realmId;
  const cluesPercent = difficultySettings.requiredCluesCount > 0
    ? (collectedClues.length / difficultySettings.requiredCluesCount) * 100
    : 0;
  const chestReady = collectedClues.length >= difficultySettings.requiredCluesCount;

  const [fish1Asset, fish2Asset] = realm.fishSpecies;
  const levelDeco = realmId === 'coral'
    ? `<div class="scene-jelly"><img src="${assetUrl('jellyfish')}" alt=""></div>`
    : realmId === 'cave'
      ? `<div class="lagoon-glow"></div><div class="cave-crystal-left"></div><div class="cave-crystal-right"></div>`
      : `<div class="scene-jelly pond-jelly"><img src="${assetUrl('jellyfish')}" alt=""></div>`;

  const axoAsset = realmId === 'pond' ? 'axolotl-happy' : realmId === 'coral' ? 'axolotl-excited' : 'axolotl-mascot';
  const chestStatus = isChestUnlocked
    ? { icon: CircleCheck, label: 'BUTTON FOUND' }
    : chestReady
      ? { icon: LockKeyholeOpen, label: 'UNLOCK CHEST' }
      : { icon: LockKeyhole, label: 'MAGICAL CHEST' };
  const missionReward = isMissionComplete
    ? `${lucideIcon(CircleCheck, 'hud-icon')} Complete!`
    : '+5 points each';

  const reefAssets: [AssetName, AssetName, AssetName] = realmId === 'coral'
    ? ['coral-branch', 'coral-fan', 'seaweed-leafy']
    : realmId === 'cave'
      ? ['coral-round', 'coral-branch', 'coral-fan']
      : ['coral-round', 'seaweed-wave', 'coral-fan'];

  const bgExtras = realmId === 'coral'
    ? `<div class="scene-extra-flora flora-left"><img src="${assetUrl('seaweed-leafy')}" alt=""></div>
     <div class="scene-extra-flora flora-right"><img src="${assetUrl('coral-branch')}" alt=""></div>`
    : realmId === 'cave'
      ? `<div class="scene-extra-flora flora-left cave-flora"><img src="${assetUrl('coral-round')}" alt=""></div>
       <div class="scene-extra-flora flora-right cave-flora"><img src="${assetUrl('coral-fan')}" alt=""></div>`
      : '';

  return `
    <main class="game-shell exploration-shell">
      <section class="ocean-scene ${realm.accentClass} theme-${realm.theme}"
        data-background="${realm.background}"
        aria-label="${realm.name}, ${realm.background}, ${level.difficulty} exploration">
        <div class="scene-sunlight"></div>
        <div class="scene-caustics"></div>
        <div class="scene-haze"></div>

        <!-- Distant reefs & seabed -->
        <div class="scene-far-reef">
          <img src="${assetUrl(reefAssets[0])}" class="distant-coral" alt="">
          <img src="${assetUrl(reefAssets[1])}" class="distant-coral" alt="">
          <img src="${assetUrl(reefAssets[2])}" class="distant-coral" alt="">
        </div>

        <div class="scene-rock scene-rock-left"></div>
        <div class="scene-rock scene-rock-right"></div>
        <div class="scene-plant plant-left">
          <img src="${assetUrl(realmId === 'coral' ? 'seaweed-leafy' : 'seaweed-wave')}" alt="">
          <img src="${assetUrl('coral-fan')}" alt="">
        </div>
        <div class="scene-plant plant-right">
          <img src="${assetUrl('seaweed-wave')}" alt="">
          <img src="${assetUrl(realmId === 'cave' ? 'coral-round' : 'coral-branch')}" alt="">
        </div>
        <div class="scene-grass"></div>
        ${bgExtras}

        <!-- Floating bubbles & swimming fish -->
        <div class="scene-bubbles bubbles-a"><img src="${assetUrl('bubbles')}" alt=""></div>
        <div class="scene-bubbles bubbles-b"><img src="${assetUrl('bubbles')}" alt=""></div>
        ${levelDeco}

        <!-- Interactive Swimming Fish for Fish API challenges -->
        <button class="swimming-fish swim-fish-1" data-action="open-fish-puzzle" title="Ask this fish a riddle">
          <img src="${assetUrl(fish1Asset)}" alt="Swimming Fish">
          <span class="fish-bubble-cue">?</span>
        </button>
        <button class="swimming-fish swim-fish-2" data-action="open-fish-puzzle" title="Ask this fish for a clue">
          <img src="${assetUrl(fish2Asset)}" alt="Swimming Fish">
          <span class="fish-bubble-cue">?</span>
        </button>

        <!-- Top Header HUD — labeled SVG navbar -->
        <header class="scene-header">

          <!-- LEFT: Home + brand -->
          <div class="hud-left-group">
            <button class="hud-home-btn" data-action="go-home" title="Return to dashboard" aria-label="Home">
              <img src="${assetUrl('icon-home')}" alt="Home" class="hud-btn-svg">
            </button>
            <div class="hud-brand-chip">
              <img src="${assetUrl('axolotl-mascot')}" alt="" class="hud-brand-axo">
              <div class="hud-brand-text">
                <span class="hud-brand-title">Axolotl's Lost Button</span>
                <span class="hud-brand-sub">${realm.name} - ${level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}</span>
              </div>
            </div>
          </div>

          <!-- CENTRE: Timer -->
          <div class="hud-centre-group">
            <div class="timer-pill ${timeFraction < 0.25 ? 'timer-warning' : ''}" title="Time remaining">
              <span class="timer-icon">${lucideIcon(Timer, 'hud-icon')}</span>
              <div class="timer-text-block">
                <span class="timer-label">TIME LEFT</span>
                <strong class="timer-val hud-timer-value">${timeRemainingStr}</strong>
              </div>
              <div class="timer-meter"><span class="timer-bar-fill" style="width: ${Math.max(0, Math.min(100, timeFraction * 100))}%"></span></div>
            </div>
          </div>

          <!-- RIGHT: Stats + action buttons -->
          <div class="hud-right-group">

            <div class="hud-stat-card" title="Your current score">
              <img src="${assetUrl('star-gold')}" alt="" class="hud-stat-svg">
              <div class="hud-stat-text">
                <span class="hud-stat-label">Score</span>
                <strong class="hud-score-value">${score}</strong>
              </div>
            </div>

            <div class="hud-stat-card" title="Pearls collected">
              <svg class="pearl-svg hud-stat-svg" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="19" fill="#fff" stroke="#d4b8db" stroke-width="2"/>
                <ellipse cx="17" cy="15" rx="5" ry="3" fill="#fff" opacity=".8"/>
              </svg>
              <div class="hud-stat-text">
                <span class="hud-stat-label">Pearls</span>
                <strong>${pearls}</strong>
              </div>
            </div>

            <div class="hud-divider" aria-hidden="true"></div>

            <button class="hud-action-btn ${soundMuted ? 'hud-btn-muted' : ''}"
              data-action="toggle-sound"
              title="${soundMuted ? 'Unmute sound' : 'Mute sound'}"
              aria-label="${soundMuted ? 'Unmute sound' : 'Mute sound'}">
              <img src="${assetUrl('icon-sound')}" alt="Sound" class="hud-btn-svg">
            </button>

            <button class="hud-action-btn"
              data-action="pause-game"
              title="Pause game (Esc)"
              aria-label="Pause game">
              <img src="${assetUrl('icon-pause')}" alt="Pause" class="hud-btn-svg">
            </button>

            <button class="hud-action-btn hud-btn-quit"
              data-action="confirm-quit-to-home"
              title="Quit to dashboard"
              aria-label="Quit to home">
              <img src="${assetUrl('icon-restart')}" alt="Quit" class="hud-btn-svg">
            </button>
          </div>

        </header>

        <!-- World Interactive Arena -->
        <div class="scene-world">
          <!-- Hidden Objects -->
          ${unfoundObjects
            .map((obj, index) => {
                      const art = obj.customSvg
                        ? obj.customSvg
                        : `<img src="${assetUrl(obj.asset || HIDDEN_OBJECT_ASSETS[obj.type] || 'shell-scallop')}" alt="${obj.name}">`;

              return `
                <button class="hidden-find ${obj.required ? 'mission-find' : 'bonus-find'}"
                  data-action="find-object"
                  data-object-id="${obj.id}"
                  style="left: ${obj.x}%; top: ${obj.y}%; animation-delay: ${index * 120}ms"
                  aria-label="${obj.name}"
                  title="Tap to find this shiny thing">
                  <span class="find-art">${art}</span>
                </button>
              `;
            })
            .join('')}

          <!-- Hint Aura Ripple (if activated) -->
          ${
            highlightedCoords
              ? `<div class="hint-aura-ripple" style="left: ${highlightedCoords.x}%; top: ${highlightedCoords.y}%">
                  <span></span><span></span>
                </div>`
              : ''
          }

          <!-- Magical Treasure Chest inside the underwater scene -->
          <button class="scene-treasure-chest ${chestReady ? 'chest-ready pulse-chest' : 'chest-locked'}"
            data-action="open-chest-modal"
            title="${chestReady ? 'Pip says the chest is ready. Set the dials!' : 'Find the clues to open this chest'}"
            aria-label="${chestReady ? 'Open the magical chest' : 'Find clues to open the magical chest'}">
            <img class="chest-world-svg" src="${assetUrl('treasure-chest')}" alt="">
            <span class="chest-world-tag">${lucideIcon(chestStatus.icon, 'hud-icon')} ${chestStatus.label}</span>
          </button>

          <!-- Pip the axolotl is ready for a chat. -->
          <div class="scene-axolotl-wrap" data-action="click-axolotl" title="Say hi to Pip">
            <img src="${assetUrl(axoAsset)}" class="scene-axolotl bobbing-axo" alt="Pip the axolotl">
            <span class="axo-speech">${axoSpeech}</span>
          </div>

          <!-- Bottom Left Mission Card -->
          <div class="scene-hud-left">
            <section class="mission-card level-${realmId}" aria-label="Level Mission">
              <span class="mission-ribbon">PIP’S TO-DO LIST</span>
              <div class="mission-title-row">
                <span class="mission-check">${lucideIcon(Search, 'hud-icon')}</span>
                <strong>Find the shiny stuff</strong>
              </div>
              <div class="mission-meter">
                <span style="width: ${Math.min(100, missionPercent)}%"></span>
              </div>
              <div class="mission-foot">
                <span>${requiredFoundCount} of ${totalRequiredCount} found</span>
                <span>${missionReward}</span>
              </div>
            </section>
          </div>

          <!-- Bottom Center/Right Action HUD -->
          <div class="scene-bottom-hud">
            <!-- Clues Card -->
            <div class="clues-hud-card level-${realmId}" data-action="open-chest-modal" title="See the clues Pip found">
              <div class="clue-card-head">
                <span>${lucideIcon(KeyRound, 'hud-icon')} CHEST CLUES</span>
                <strong>${collectedClues.length} / ${difficultySettings.requiredCluesCount}</strong>
              </div>
              <div class="clue-card-meter"><span style="width: ${Math.min(100, cluesPercent)}%"></span></div>
              <small>${chestReady ? 'Clues ready! Open the chest!' : 'Ask fish to find clues'}</small>
            </div>

            <!-- Hint Button -->
            <button class="hint-hud-button ${hintsRemaining > 0 ? '' : 'exhausted'}" data-action="use-hint" ${hintsRemaining <= 0 ? 'disabled' : ''}>
              ${lucideIcon(Lightbulb, 'mini-icon hud-icon')}
              <div>
                <strong>STUCK? ASK PIP</strong>
                <small>${hintsRemaining} hint${hintsRemaining === 1 ? '' : 's'} left</small>
              </div>
            </button>

            <!-- Talk to Fish Button -->
            <button class="fish-portal" data-action="open-fish-puzzle" title="Solve a live Fish API puzzle">
              <span class="portal-icon"><img src="${assetUrl('fish-lavender')}" alt=""></span>
              <span>
                <small>NEED A CLUE?</small>
                <strong>Fish riddle</strong>
              </span>
              <span class="portal-arrow">${lucideIcon(ArrowUpRight, 'hud-icon')}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  `;
}
