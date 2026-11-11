import { GRID_SIZE, type GameState } from './logic';

export interface Labels {
  score: string;
  time: string;
  status: string;
}

/** Draws the board. Returns nothing to draw on when the canvas has no 2D context, as in some tests. */
export function createRenderer(canvas: HTMLCanvasElement | undefined): (state: GameState, labels: Labels) => void {
  const context = canvas?.getContext('2d') ?? null;
  if (!canvas || !context) return () => {};

  return (state, labels) => {
    const { width, height } = canvas;
    const board = Math.min(width, height - 60);
    const cell = board / GRID_SIZE;
    context.fillStyle = '#0b1020';
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index++) {
      const x = (index % GRID_SIZE) * cell;
      const y = 60 + Math.floor(index / GRID_SIZE) * cell;
      const lit = state.phase === 'playing' && index === state.target;
      context.fillStyle = lit ? '#ffd23f' : '#1f2a4d';
      context.fillRect(x + 6, y + 6, cell - 12, cell - 12);
      context.fillStyle = lit ? '#0b1020' : '#8a96c9';
      context.font = '20px system-ui, sans-serif';
      context.fillText(String(index + 1), x + 16, y + 34);
    }

    context.fillStyle = '#f4f6ff';
    context.font = '22px system-ui, sans-serif';
    context.fillText(labels.score, 12, 28);
    context.fillText(labels.time, width - 150, 28);
    context.font = '16px system-ui, sans-serif';
    context.fillText(labels.status, 12, 52);
  };
}
