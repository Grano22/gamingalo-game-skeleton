import type { GamingaloSdk } from '@gamingalo/sdk';
import { MESSAGES } from '../i18n/messages';
import { createGame, hit, setDifficulty, start, tick, type Difficulty, type GameState } from './logic';
import { createRenderer } from './renderer';

const SAVE_SLOT = 'progress';

/** Version 1 of the save format. Bump `version` and add a migration when it changes. */
interface ProgressV1 {
  best: number;
}

export interface RunningGame {
  readonly state: () => GameState;
  start(): void;
  hit(square: number): void;
  advance(elapsedMs: number): void;
  setDifficulty(difficulty: Difficulty): void;
  stop(): void;
}

/**
 * Connects the rules to the SDK: saves, preferences, localization and accessibility.
 * The SDK is passed in, so tests can use `createMockSdk` from `@gamingalo/sdk/testing`.
 */
export async function runGame(sdk: GamingaloSdk, canvas?: HTMLCanvasElement): Promise<RunningGame> {
  const { localization, accessibility, preferences } = sdk;
  for (const [locale, messages] of Object.entries(MESSAGES)) localization.addMessages(locale, messages);

  preferences.define({
    difficulty: { type: 'string', default: 'normal', options: ['easy', 'normal', 'hard'] },
  });

  // Saves need IndexedDB, which some browsers block. The game still runs, without keeping a best score.
  const canSave = sdk.features.has('saves');
  if (canSave) sdk.saves.configure({ version: 1 });
  const saved = canSave ? await sdk.saves.read<ProgressV1>(SAVE_SLOT) : undefined;

  let state = createGame({
    best: saved?.data.best ?? 0,
    difficulty: preferences.get('difficulty', 'normal') as Difficulty,
    seed: Date.now() >>> 0,
  });
  let greeting = '';
  const draw = createRenderer(canvas);

  const t = (key: string, params?: Record<string, string | number>) => localization.t(key, params);
  const statusText = () => {
    if (state.phase === 'over') return t('over', { score: t('score', { count: state.score }) });
    if (state.phase === 'menu') return [greeting, t('menu'), t('best', { best: state.best })].filter(Boolean).join(' · ');
    return t('best', { best: state.best });
  };

  const render = () => {
    draw(state, {
      score: t('score', { count: state.score }),
      time: t('time', { seconds: Math.ceil(state.timeLeftMs / 1000) }),
      status: statusText(),
    });
    // Mirrors the controls for keyboards and screen readers, because a canvas is invisible to them.
    accessibility.mirror([
      { id: 'status', role: 'text', label: statusText() },
      ...(state.phase === 'playing'
        ? Array.from({ length: 9 }, (_, index) => ({
            id: `square-${index}`,
            role: 'button' as const,
            label: t('square', { number: index + 1 }),
            onActivate: () => api.hit(index),
          }))
        : [{ id: 'start', role: 'button' as const, label: t('start'), onActivate: () => api.start() }]),
    ]);
  };

  const finish = async (previous: GameState) => {
    accessibility.announce(statusText(), { assertive: true });
    if (state.best > previous.best && canSave) {
      await sdk.saves.write(SAVE_SLOT, { best: state.best } satisfies ProgressV1);
    }
  };

  const api: RunningGame = {
    state: () => state,
    start() {
      state = start(state);
      render();
    },
    hit(square) {
      const before = state.score;
      state = hit(state, square);
      if (state.score > before && state.score % 5 === 0) accessibility.announce(t('score', { count: state.score }));
      render();
    },
    advance(elapsedMs) {
      const previous = state;
      state = tick(state, elapsedMs);
      if (previous.phase === 'playing' && state.phase === 'over') void finish(previous);
      render();
    },
    setDifficulty(difficulty) {
      state = setDifficulty(state, difficulty);
      preferences.set('difficulty', state.difficulty);
      render();
    },
    stop() {
      unsubscribe.forEach((off) => off());
    },
  };

  const unsubscribe = [
    // A hidden tab pauses the round, because `advance` stops being called while suspended.
    sdk.on('locale', () => render()),
    sdk.on('preferences', ({ key, value }) => {
      if (key === 'difficulty' && typeof value === 'string') state = setDifficulty(state, value as Difficulty);
      render();
    }),
  ];

  if (sdk.features.has('player') && sdk.player.available()) {
    sdk.player
      .profile()
      .then((player) => {
        greeting = t('hello', { name: player.displayName });
        render();
      })
      .catch(() => {
        // Playing without a signed-in player is fine.
      });
  }

  render();
  return api;
}
