/// <reference types="node" />
// Node types only here: this test reads global.css from disk; app code never sees Node APIs.
import { readFileSync } from 'fs';
import { join } from 'path';

import { hslToHex } from './color';
import { THEME, type ColorScheme, type ThemeColors } from './theme';

const CSS = readFileSync(join(__dirname, '..', 'global.css'), 'utf8');

function kebabToCamel(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

/** Reads the colour variables of one CSS block (`:root {…}` or `.dark:root {…}`) as hex. */
function readBlock(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.:]/g, (c) => `\\${c}`);
  const block = new RegExp(`(?:^|\\s)${escaped}\\s*\\{([^}]*)\\}`, 'm').exec(CSS)?.[1];
  if (block === undefined) throw new Error(`global.css has no ${selector} block`);

  const colors: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z0-9-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g)) {
    const [, name, h, s, l] = match;
    if (!name || !h || !s || !l) continue;
    colors[kebabToCamel(name)] = hslToHex(Number(h), Number(s), Number(l));
  }
  return colors;
}

const BLOCKS: Record<ColorScheme, string> = { light: ':root', dark: '.dark:root' };

describe.each(Object.keys(BLOCKS) as ColorScheme[])('global.css %s block', (scheme) => {
  const css = readBlock(BLOCKS[scheme]);
  const ts: Readonly<ThemeColors> = THEME[scheme];

  it('declares exactly the tokens of lib/theme.ts', () => {
    expect(Object.keys(css).sort()).toEqual(Object.keys(ts).sort());
  });

  it.each(Object.keys(ts) as (keyof ThemeColors)[])('%s matches lib/theme.ts', (key) => {
    expect(css[key]).toBe(ts[key].toUpperCase());
  });
});

describe('global.css', () => {
  it('sets the 12pt radius', () => {
    expect(CSS).toMatch(/--radius:\s*0\.75rem;/);
  });
});
