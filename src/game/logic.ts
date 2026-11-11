/**
 * The rules, with no browser or SDK code, so they're easy to test and reason about.
 * Every function returns a new state, and the same inputs always give the same result.
 */

export type Difficulty = 'easy' | 'normal' | 'hard';
export type Phase = 'menu' | 'playing' | 'over';

export interface GameState {
  readonly phase: Phase;
  readonly score: number;
  readonly best: number;
  readonly timeLeftMs: number;
  /** The lit square, 0 to 8. */
  readonly target: number;
  readonly targetAgeMs: number;
  readonly difficulty: Difficulty;
  /** State for the random number generator, so a round can be replayed exactly. */
  readonly seed: number;
}

export const ROUND_MS = 30_000;
export const GRID_SIZE = 3;

/** How long a square stays lit before it moves. */
export const TARGET_MS: Readonly<Record<Difficulty, number>> = Object.freeze({ easy: 1600, normal: 1100, hard: 700 });

/** A small, fast generator (mulberry32). Returns the next value from 0 to 1, and the next seed. */
export function random(seed: number): { value: number; seed: number } {
  let t = (seed + 0x6d2b79f5) | 0;
  const next = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, seed: next };
}

function nextTarget(state: GameState): Pick<GameState, 'target' | 'seed'> {
  let { seed } = state;
  let target = state.target;
  // Never the same square twice in a row, so a move is always visible.
  while (target === state.target) {
    const roll = random(seed);
    seed = roll.seed;
    target = Math.floor(roll.value * GRID_SIZE * GRID_SIZE);
  }
  return { target, seed };
}

export function createGame(options: { best?: number; difficulty?: Difficulty; seed?: number } = {}): GameState {
  return {
    phase: 'menu',
    score: 0,
    best: options.best ?? 0,
    timeLeftMs: ROUND_MS,
    target: 4,
    targetAgeMs: 0,
    difficulty: options.difficulty ?? 'normal',
    seed: options.seed ?? 1,
  };
}

export function start(state: GameState): GameState {
  if (state.phase === 'playing') return state;
  const started: GameState = { ...state, phase: 'playing', score: 0, timeLeftMs: ROUND_MS, targetAgeMs: 0 };
  return { ...started, ...nextTarget(started) };
}

export function tick(state: GameState, elapsedMs: number): GameState {
  if (state.phase !== 'playing' || elapsedMs <= 0) return state;
  const timeLeftMs = Math.max(0, state.timeLeftMs - elapsedMs);
  if (timeLeftMs === 0) {
    return { ...state, phase: 'over', timeLeftMs, best: Math.max(state.best, state.score) };
  }
  const aged: GameState = { ...state, timeLeftMs, targetAgeMs: state.targetAgeMs + elapsedMs };
  return aged.targetAgeMs >= TARGET_MS[state.difficulty] ? { ...aged, ...nextTarget(aged), targetAgeMs: 0 } : aged;
}

/** A hit on the lit square scores a point and moves it. A miss does nothing. */
export function hit(state: GameState, square: number): GameState {
  if (state.phase !== 'playing' || square !== state.target) return state;
  const scored: GameState = { ...state, score: state.score + 1, targetAgeMs: 0 };
  return { ...scored, ...nextTarget(scored) };
}

export function setDifficulty(state: GameState, difficulty: Difficulty): GameState {
  return state.phase === 'playing' ? state : { ...state, difficulty };
}
