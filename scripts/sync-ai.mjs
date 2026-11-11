// Copies the shared skills in .agents/skills to .claude/skills, which Claude Code reads.
// With --check, fails instead of copying if the copy is out of date.
import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const source = join(root, '.agents/skills');
const target = join(root, '.claude/skills');
const check = process.argv.includes('--check');

async function files(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await files(path)));
    else found.push(path);
  }
  return found;
}

const expected = new Map();
for (const file of await files(source)) expected.set(relative(source, file), await readFile(file, 'utf8'));
const actual = new Map();
for (const file of await files(target)) actual.set(relative(target, file), await readFile(file, 'utf8'));

const differences = [...new Set([...expected.keys(), ...actual.keys()])].filter((file) => expected.get(file) !== actual.get(file));

if (check) {
  if (differences.length > 0) {
    console.error(`.claude/skills is out of date (${differences.join(', ')}). Run npm run ai:sync.`);
    process.exit(1);
  }
  console.log('AI skills are in sync.');
} else {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
  console.log(`Copied ${expected.size} skill files to .claude/skills.`);
}
