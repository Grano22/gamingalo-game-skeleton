import { describe, expect, it } from 'vitest';
import { createGame, hit, random, ROUND_MS, setDifficulty, start, TARGET_MS, tick } from './logic';

describe('logic', () => {
  it('starts in the menu, and a round starts with a new lit square', () => {
    const game = createGame();
    expect(game.phase).toBe('menu');
    const playing = start(game);
    expect(playing).toMatchObject({ phase: 'playing', score: 0, timeLeftMs: ROUND_MS });
    expect(playing.target).not.toBe(game.target);
  });

  it('scores a hit on the lit square only', () => {
    const playing = start(createGame());
    const missed = hit(playing, (playing.target + 1) % 9);
    expect(missed).toBe(playing);
    const scored = hit(playing, playing.target);
    expect(scored.score).toBe(1);
    expect(scored.target).not.toBe(playing.target);
  });

  it('moves the square when it has been lit too long', () => {
    const playing = start(createGame({ difficulty: 'hard' }));
    const moved = tick(playing, TARGET_MS.hard);
    expect(moved.target).not.toBe(playing.target);
    expect(moved.targetAgeMs).toBe(0);
  });

  it('ends the round, and keeps the best score', () => {
    let game = start(createGame({ best: 1 }));
    game = hit(hit(game, game.target), hit(game, game.target).target);
    const over = tick(game, ROUND_MS);
    expect(over).toMatchObject({ phase: 'over', timeLeftMs: 0, best: 2 });
  });

  it('is deterministic for the same seed', () => {
    const run = () => tick(hit(start(createGame({ seed: 42 })), 0), 5000);
    expect(run()).toEqual(run());
    expect(random(42)).toEqual(random(42));
  });

  it('only changes difficulty outside a round', () => {
    expect(setDifficulty(createGame(), 'easy').difficulty).toBe('easy');
    const playing = start(createGame());
    expect(setDifficulty(playing, 'easy')).toBe(playing);
  });

  it('ignores time while not playing', () => {
    const game = createGame();
    expect(tick(game, 1000)).toBe(game);
  });
});
