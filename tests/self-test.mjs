import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const required = [
  'index.js',
  'openclaw.plugin.json',
  'package.json',
  'README.md',
  'SECURITY.md',
  'LICENSE.md',
  'COMMERCIAL.md',
  'PUBLISHING_CHECKLIST.md',
  'skills/production/SKILL.md',
];

const forbiddenPathParts = [
  'lib/Production',
  'migrations',
  'storage',
  'logs',
  'vendor',
  'node_modules',
  '.env',
];

const secretPatterns = [
  /om_(live|claw|test)_[A-Za-z0-9]{8,}/,
  /\b\d{8,12}:[A-Za-z0-9_-]{25,}\b/,
  /BEGIN (RSA |OPENSSH |PRIVATE )?KEY/,
  /password\s*=/i,
  /secret\s*=/i,
  /api[_-]?key\s*=/i,
];

for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    throw new Error(`missing required file: ${file}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.private !== false) {
  throw new Error('package must be distributable as a standalone package: private=false');
}
if (!String(packageJson.description || '').toLowerCase().includes('thin')) {
  throw new Error('package description must declare thin-client boundary');
}

JSON.parse(fs.readFileSync(path.join(root, 'openclaw.plugin.json'), 'utf8'));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  for (const forbidden of forbiddenPathParts) {
    if (rel.includes(forbidden)) {
      throw new Error(`forbidden path in distribution: ${rel}`);
    }
  }
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) {
      throw new Error(`secret-like pattern found in ${rel}: ${pattern}`);
    }
  }
}

const source = fs.readFileSync(path.join(root, 'index.js'), 'utf8');
if (source.includes('/api/production/')) {
  throw new Error('thin client must use /api/v1/claw tools, not direct production endpoints');
}
if (!source.includes('/claw/tools')) {
  throw new Error('thin client must call /api/v1/claw/tools');
}

console.log('self-test ok');
