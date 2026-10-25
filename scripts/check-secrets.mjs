import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// Also works before Git initialization. Never print a matching value.
const patterns = [
  ['Supabase secret key', /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_.-]{20,}\b/g],
  ['Google OAuth secret', /\bGOCSPX-[A-Za-z0-9_-]{20,}\b/g],
  ['Google OAuth refresh token', /\b1\/\/[A-Za-z0-9_-]{20,}\b/g],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/g],
  ['Private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['Database URL with password', /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/g],
];
const excludedDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const findings = [];
let count = 0;
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    const display = relative(process.cwd(), file);
    if (entry.isSymbolicLink()) { findings.push(`${display}: symlink is not an allowed source input`); continue; }
    if (entry.isDirectory()) { if (!excludedDirectories.has(entry.name)) walk(file); continue; }
    if (/^(\.env($|\.)|credentials)/i.test(entry.name) || /\.(pem|key|dpapi|rms|dump)$/i.test(entry.name)) {
      findings.push(`${display}: private file must not be in this repository`); continue;
    }
    const bytes = readFileSync(file);
    if (bytes.includes(0) || bytes.byteLength > 2_000_000) {
      findings.push(`${display}: binary or oversized file requires explicit review`); continue;
    }
    count++;
    const text = bytes.toString('utf8');
    for (const [label, pattern] of patterns) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) findings.push(`${display}:${text.slice(0, match.index).split('\n').length}: ${label}`);
    }
  }
}
walk(process.cwd());
if (findings.length) { console.error(findings.join('\n')); process.exitCode = 1; }
else console.log(`Secret scan PASS: ${count} source files; no matching values printed.`);
