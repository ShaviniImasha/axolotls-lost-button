# Axolotl’s Lost Button

A cute, cozy, interactive underwater puzzle adventure game built with HTML, CSS, TypeScript, Express.js, Firebase Authentication, Firestore Database, and the live Marc Conrad Fish Game API.

---

## Game Story & Overview

The player journeys as the ocean companion to an adorable axolotl whose favourite magical button was lost in the deep!
Explore 3 unique underwater realms, each playable at all 3 difficulties (9 levels total):
- **Magical Pond**: Calm, sunlit waters with gentle pond minnows and water lilies.
- **Coral Garden**: Colorful pastel coral formations with inquisitive reef fish.
- **Enchanted Treasure Cave**: A twilight abyss shimmering with glowing crystals and cave dwellers.

Each realm has Easy, Medium, and Hard variants with separate level IDs (for example, `pond-easy` and `cave-hard`). Easy is open in the first realm; Medium and Hard unlock as you complete the matching difficulty in that realm. A realm’s Easy level unlocks after beating the previous realm’s Easy.

Players discover hidden objects (pearls, shells, starfish, glowing message bottles, ancient coins, magic keys), solve live math riddles from swimming fish via the **Fish API**, decipher secret runic combinations, and open the magical **Treasure Chest** to recover **Axolotl's Lost Button**!

---

## Running the Project

### 1. Install Dependencies
```sh
npm install
```

### 2. Environment Configuration (Firebase & Backend)
Copy `.env.example` to `.env` to configure Firebase:
```sh
cp .env.example .env
```
Configure your Firebase Web app keys (`VITE_FIREBASE_API_KEY`, etc.) and Firebase Admin credentials in `.env`.
*Note: If Firebase credentials are not yet added, the game automatically runs in local player mode with in-memory & browser storage so you can immediately test and play all features without barriers.*

### 3. Run the Backend Server
```sh
npm run server
```
Runs the Express.js server at `http://localhost:3001` with API endpoints:
- `GET /api/health`
- `GET /api/auth/verify`
- `GET /api/progress/:userId`
- `POST /api/progress/:userId`
- `GET /api/leaderboard`

### 4. Run the Frontend Game
```sh
npm run dev
```
Starts the Vite dev server with proxy support at `http://localhost:5173`.

### 5. Running Tests & Quality Checks
```sh
npm run typecheck    # TypeScript compiler check
npm test             # Vitest test suite (48 tests across 14 test files)
npm run build        # Production bundle build
```

---

## Game Architecture & Modules

The application is structured following low coupling and high cohesion:

- **Authentication & Database**:
  - `src/firebase/config.ts`: Client Firebase initialization & config checker.
  - `src/services/authService.ts`: Email/password, Google OAuth, session management.
  - `src/services/firestoreService.ts`: Real-time Firestore profile and progress sync.
  - `src/services/leaderboardService.ts`: Top explorer rankings with podium styling.
  - `src/services/audioService.ts`: Web Audio API synthesizer for sound effects and celebrations.

- **Game Logic**:
  - `src/game/gameController.ts`: Central state manager coordinating gameplay.
  - `src/game/levelManager.ts`: 3 realms × 3 shared difficulty configurations, unlock rules, and level IDs.
  - `src/game/hiddenObjectManager.ts`: Deterministic per-level object placement, discovery, and duplicate prevention.
  - `src/game/puzzleManager.ts`: Live Fish API challenge handling, 0-9 answers, feedback.
  - `src/game/scoringSystem.ts`: Enforces scoring rules (+10 fish, -5 wrong, +5 find, +10 treasure, +30 win).
  - `src/game/timerManager.ts`: Countdown timer with pause/resume and expiration callbacks.
  - `src/game/hintManager.ts`: Difficulty-tiered hint system with golden locator ripple aura.
  - `src/game/treasureChestLogic.ts`: Interactive 3-rune combination dials, clues ledger, and button reveal.
  - `src/game/playerProgressManager.ts`: Bridges local progress with Firestore persistence.

- **Main Screens**:
  1. Landing Page (`src/components/LandingPage.ts`)
  2. Login Page with Google OAuth (`src/components/LoginPage.ts`)
  3. Registration Page (`src/components/RegisterPage.ts`)
  4. Home Page / Player Dashboard (`src/components/HomePage.ts`)
  5. Level Selection Screen (`src/components/LevelSelectPage.ts`)
  6. Main Exploration Screen (`src/components/ExplorationScreen.ts`)
  7. Fish Puzzle Overlay (`src/components/FishPuzzleOverlay.ts`)
  8. Hidden Treasure Chest Screen (`src/components/TreasureChestModal.ts`)
  9. Level Completion & Lost Button Screen (`src/components/LevelCompleteScreen.ts`)
  10. Leaderboard Screen (`src/components/LeaderboardScreen.ts`)
  - Plus Pause Menu (`src/components/PauseOverlay.ts`) & Confirmation Dialogs (`src/components/ConfirmDialog.ts`).

- **Backend Express Service**:
  - `server/server.ts`: Express application with CORS and JSON body parser.
  - `server/firebaseAdmin.ts`: Firebase Admin SDK initialization.
  - `server/middleware/authMiddleware.ts`: Token verification middleware.
  - `server/routes/authRoutes.ts`, `server/routes/progressRoutes.ts`, `server/routes/leaderboardRoutes.ts`.
