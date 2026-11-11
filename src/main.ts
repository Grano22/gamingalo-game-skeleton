import { isGamingaloError } from '@gamingalo/sdk';
import { runGame } from './game/game';
import type { Difficulty } from './game/logic';
import { startSdk } from './sdk';

const canvas = document.querySelector<HTMLCanvasElement>('#game');
if (!canvas) throw new Error('The page has no #game canvas.');

try {
  const sdk = await startSdk(canvas);
  const game = await runGame(sdk, canvas);

  // Pauses with the tab: no frames are requested while the SDK reports the game as suspended.
  let paused = false;
  sdk.on('suspend', () => (paused = true));
  sdk.on('resume', () => (paused = false));

  let last = performance.now();
  const frame = (now: number) => {
    if (!paused) game.advance(now - last);
    last = now;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  canvas.addEventListener('pointerdown', (event) => {
    const box = canvas.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * canvas.width;
    const y = ((event.clientY - box.top) / box.height) * canvas.height - 60;
    const cell = Math.min(canvas.width, canvas.height - 60) / 3;
    if (y < 0) return;
    game.hit(Math.floor(y / cell) * 3 + Math.floor(x / cell));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      game.start();
    } else if (/^[1-9]$/.test(event.key)) {
      game.hit(Number(event.key) - 1);
    } else if (event.key === 'e' || event.key === 'n' || event.key === 'h') {
      const difficulty: Record<string, Difficulty> = { e: 'easy', n: 'normal', h: 'hard' };
      game.setDifficulty(difficulty[event.key] as Difficulty);
    }
  });
} catch (error) {
  // Another script starting the SDK first is treated as tampering, and the game doesn't run.
  const message = isGamingaloError(error) ? `${error.code}: ${error.message}` : String(error);
  document.querySelector('#hint')!.textContent = `The game could not start. ${message}`;
  throw error;
}
