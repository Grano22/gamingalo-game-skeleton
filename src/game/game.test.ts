import { screenPreferences, type ScreenPreferences } from '@gamingalo/plugin-screen-preferences';
import { createMockSdk } from '@gamingalo/sdk/testing';
import { describe, expect, it } from 'vitest';
import { ROUND_MS } from './logic';
import { runGame } from './game';

const modules = ['localization', 'accessibility'] as const;

describe('game with the SDK', () => {
  it('saves a new best score, and loads it next time', async () => {
    const sdk = await createMockSdk({ modules: [...modules] });
    const game = await runGame(sdk);
    game.start();
    game.hit(game.state().target);
    game.advance(ROUND_MS);
    await expect.poll(async () => (await sdk.saves.read<{ best: number }>('progress'))?.data.best).toBe(1);

    const again = await runGame(sdk);
    expect(again.state().best).toBe(1);
  });

  it('remembers the difficulty as a player preference', async () => {
    const sdk = await createMockSdk({ modules: [...modules] });
    const game = await runGame(sdk);
    game.setDifficulty('hard');
    expect(sdk.preferences.get('difficulty')).toBe('hard');
    expect((await runGame(sdk)).state().difficulty).toBe('hard');
  });

  it('exposes controls to assistive technology, and announces the result', async () => {
    const sdk = await createMockSdk({ modules: [...modules] });
    const game = await runGame(sdk);
    expect(sdk.mock.accessibility.mirrorItems().map((item) => item.label)).toContain('Start game');

    sdk.mock.accessibility.activate('start');
    expect(game.state().phase).toBe('playing');
    expect(sdk.mock.accessibility.mirrorItems().filter((item) => item.role === 'button')).toHaveLength(9);

    game.advance(ROUND_MS);
    expect(sdk.mock.accessibility.announcements().at(-1)).toContain('Time is up!');
  });

  it('speaks the player’s language', async () => {
    const sdk = await createMockSdk({ modules: [...modules], localization: { languages: ['pl-PL'] } });
    const game = await runGame(sdk);
    game.start();
    game.advance(ROUND_MS);
    expect(sdk.mock.accessibility.announcements().at(-1)).toBe('Koniec czasu! 0 punktów');
  });

  it('greets the signed-in player', async () => {
    const sdk = await createMockSdk({ modules: [...modules], player: { displayName: 'Ada' } });
    await runGame(sdk);
    await expect.poll(() => sdk.mock.accessibility.mirrorItems()[0]?.label).toContain('Hello, Ada');
  });

  it('lets players adjust the screen through the installed plugin', async () => {
    const plugin = screenPreferences();
    const sdk = await createMockSdk({ modules: [...modules], plugins: [plugin] });
    const screen: ScreenPreferences = sdk.use(plugin);
    screen.setBrightness(1.2);
    expect(sdk.mock.canvasFilter()).toBe('brightness(1.2)');
  });
});
