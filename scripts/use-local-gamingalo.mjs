// Installs Gamingalo packages from a local checkout of the gamingalo monorepo, without changing
// package.json. Useful before the packages are published, or to try unreleased SDK changes.
//
//   node scripts/use-local-gamingalo.mjs ../gamingalo
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const monorepo = resolve(process.argv[2] ?? '../gamingalo');
const packages = ['sdk', 'plugin-screen-preferences', 'vite-plugin', 'cli'];
const out = mkdtempSync(join(tmpdir(), 'gamingalo-packs-'));

const tarballs = packages.map((name) => {
  const dir = join(monorepo, 'packages', name);
  const result = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', out], { cwd: dir, encoding: 'utf8' }));
  // npm 11 and earlier return a list, and npm 12 an object keyed by package name.
  const [file] = Array.isArray(result) ? result : Object.values(result);
  return join(out, file.filename);
});
execFileSync('npm', ['install', '--no-save', ...tarballs], { stdio: 'inherit' });
console.log(`Installed ${packages.length} local packages from ${monorepo}. Build them there first with npx nx run-many -t build.`);
