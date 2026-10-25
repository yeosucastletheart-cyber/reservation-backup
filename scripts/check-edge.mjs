import { spawnSync } from 'node:child_process';

// Exactly the Deno image used by the source backend's validated Edge checks.
const image = 'denoland/deno:2.1.4@sha256:3bf75873714baa410dcf7fabaf76d806d20f0ac8a7579df11577b4ed97416e34';
const status = spawnSync('docker', ['version', '--format', '{{.Server.Version}}'], { encoding: 'utf8' });
if (status.error || status.status !== 0 || !status.stdout.trim()) {
  throw new Error('Docker engine unavailable. Use the approved Docker Safe Start before retrying on Windows.');
}
function run(args) {
  const result = spawnSync('docker', ['run', '--rm', '--network', 'none', '--read-only',
    '--tmpfs', '/tmp', '-e', 'DENO_DIR=/tmp/deno', '-v', `${process.cwd()}:/workspace:ro`,
    '-w', '/workspace', image, 'deno', ...args], { stdio: 'inherit', timeout: 180000 });
  if (result.error || result.status !== 0) throw new Error('EDGE_VALIDATION_FAILED');
}
const handler = 'supabase/functions/reservation-backup-monitor/index.ts';
run(['check', '--no-config', '--no-lock', handler]);
run(['test', '--no-config', '--no-lock',
  '--allow-env=RESERVATION_BACKUP_MONITOR_KEY_SHA256,RESERVATION_BACKUP_MONITOR_INVOKE_MODE,RESERVATION_BACKUP_MONITOR_ENABLED,SUPABASE_URL',
  'supabase/functions/reservation-backup-monitor/index.deno.ts']);
console.log('Backup monitor Deno check and network-isolated boundary tests PASS. No DB or deployment executed.');
