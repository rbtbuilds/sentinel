#!/usr/bin/env node

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const targetDir = join(process.cwd(), '.claude', 'commands');
const skillSource = join(__dirname, 'pentest.md');
const skillDest = join(targetDir, 'pentest.md');

console.log('\n  Sentinel Installer\n');

if (existsSync(skillDest)) {
  console.log('  [!] /pentest command already exists at:');
  console.log(`      ${skillDest}`);
  console.log('  Overwriting with latest version...\n');
}

mkdirSync(targetDir, { recursive: true });
writeFileSync(skillDest, readFileSync(skillSource, 'utf-8'));

console.log('  [+] Installed /pentest command to:');
console.log(`      ${skillDest}\n`);
console.log('  Usage in Claude Code:\n');
console.log('    /pentest https://example.com /path/to/repo');
console.log('    /pentest https://example.com /path/to/repo --skip-exploit');
console.log('    /pentest https://example.com /path/to/repo --focus auth\n');
