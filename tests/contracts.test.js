import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { TRANSLATIONS } from '../src/lib/i18n/translations.js';
import { TOOLS } from '../src/lib/config/tools.js';

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? files(resolve(directory, entry.name)) : resolve(directory, entry.name)
      )
    )
  ).flat();
}
const sourceFiles = (await files('src')).filter((path) => /\.(?:js|ts|svelte)$/.test(path));
test('Relative static module imports resolve', async () => {
  for (const file of sourceFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(|import\s*)['"](\.[^'"]+)['"]/g)) {
      const target = resolve(dirname(file), match[1]);
      assert.ok((await stat(target).catch(() => null))?.isFile(), `${file}: ${match[1]}`);
    }
  }
});
test('Both languages cover literal calls and the full tool catalogue', async () => {
  assert.deepEqual(Object.keys(TRANSLATIONS.fr).sort(), Object.keys(TRANSLATIONS.en).sort());
  const keys = new Set(TOOLS.flatMap((tool) => [tool.title, tool.desc]));
  for (const file of sourceFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/(?:translate|\$t)\(\s*['"]([^'"]+)['"]\s*\)/g)) keys.add(match[1]);
  }
  for (const key of keys)
    for (const locale of ['fr', 'en']) assert.ok(key in TRANSLATIONS[locale], `${locale}: ${key}`);
});
