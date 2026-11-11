import { Gamingalo, type GamingaloConfig, type GamingaloSdk } from '@gamingalo/sdk';
import { plugins } from 'virtual:gamingalo-plugins';
import config from '../gamingalo.json';

/**
 * Starts the SDK once, and returns the only reference to it. Keep it private: there's no way to
 * look it up later, and another script calling `init` first makes this one fail, on purpose.
 */
export async function startSdk(canvas: HTMLCanvasElement): Promise<GamingaloSdk> {
  const platformOrigin = import.meta.env['VITE_GAMINGALO_PLATFORM_ORIGIN'] as string | undefined;
  const options: GamingaloConfig = {
    gameId: config.id,
    realm: { canvas },
    // Built-in modules this game uses. Others stay out of the download.
    modules: ['localization', 'accessibility'],
    // Installed plugin packages, found by @gamingalo/vite-plugin.
    plugins,
    ...(platformOrigin ? { platform: { origin: platformOrigin } } : {}),
  };
  return Gamingalo.init(options);
}
