import { copyFileSync, cpSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** Resolve cyberdesign package root from workspace, node_modules, or monorepo sibling. */
function resolveCyberdesignRoot() {
  const candidates = [
    resolve(root, 'node_modules/@nukleas/cyberdesign'),
    resolve(root, '../cyberdesign'),
    resolve(root, '../../node_modules/@nukleas/cyberdesign'),
  ];
  for (const dir of candidates) {
    if (existsSync(resolve(dir, 'package.json'))) {
      try {
        const pkg = JSON.parse(readFileSync(resolve(dir, 'package.json'), 'utf8'));
        if (pkg.name === '@nukleas/cyberdesign') return dir;
      } catch {
        /* continue */
      }
    }
  }
  throw new Error(
    'Could not find cyberdesign package. From monorepo root run: pnpm install && pnpm build:css',
  );
}

const cyberdesignRoot = resolveCyberdesignRoot();
const cssSrc = resolve(cyberdesignRoot, 'dist/cyberdesign.css');
const cssDest = resolve(root, 'dist/styles.css');
const fontsSrc = resolve(cyberdesignRoot, 'dist/fonts');
const fontsDest = resolve(root, 'dist/fonts');

if (!existsSync(cssSrc)) {
  console.error(
    `Missing ${cssSrc}. Build cyberdesign first:\n  pnpm --filter cyberdesign build`,
  );
  process.exit(1);
}

mkdirSync(resolve(root, 'dist'), { recursive: true });
copyFileSync(cssSrc, cssDest);
console.log(`✓ copied cyberdesign.css → dist/styles.css`);

if (existsSync(fontsSrc)) {
  cpSync(fontsSrc, fontsDest, { recursive: true });
  console.log(`✓ copied fonts/ → dist/fonts/`);
}
