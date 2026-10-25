import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const fixedRepository = 'yeosucastletheart-cyber/reservation-backup';
function execute(overrides: Record<string, string> = {}) {
  const script = `
    process.argv = ['node', 'scripts/reservation-backup-alert.mjs'];
    globalThis.fetch = async (url, options) => {
      process.stdout.write('REQUEST ' + String(url) + '\\n');
      return Response.json(options.method === 'GET'
        ? { number: 123, state: 'open', comments: 0, body: '<!-- rms-reservation-backup-monitor:v1 -->' }
        : { id: 456 });
    };
    await import('./scripts/reservation-backup-alert.mjs');
  `;
  return spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', script], {
    cwd: process.cwd(), encoding: 'utf8', timeout: 10000,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot,
      GITHUB_REPOSITORY: fixedRepository, GITHUB_REF: 'refs/heads/main',
      RESERVATION_BACKUP_ENABLED: 'true', RESERVATION_BACKUP_RESULT: 'failure',
      RESERVATION_BACKUP_ALERT_ISSUE: '123', GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '1',
      GITHUB_TOKEN: ['ghs', 'syntheticInstallationForRuntimeTest'].join('_'), ...overrides },
  });
}
describe('standalone alert command execution boundary', () => {
  it.each([
    { GITHUB_REPOSITORY: 'wrongstory/room-management-system-backend' },
    { GITHUB_REPOSITORY: 'another-owner/reservation-backup' },
    { GITHUB_REF: 'refs/heads/dev' },
    { RESERVATION_BACKUP_ENABLED: '' },
    { RESERVATION_BACKUP_RESULT: 'success' },
  ])('rejects invalid runtime scope before external access: %j', (change) => {
    const result = execute(change);
    expect(result.error).toBeUndefined(); expect(result.status).toBe(1);
    expect(result.stderr).toContain('BACKUP_ALERT_FAILED'); expect(result.stdout).not.toContain('REQUEST');
  });
  it('publishes only to the Castle repository after the runtime scope passes', () => {
    const result = execute();
    expect(result.error).toBeUndefined(); expect(result.status).toBe(0);
    const calls = result.stdout.split('\n').filter(line => line.startsWith('REQUEST'));
    expect(calls).toHaveLength(3);
    expect(calls.every(line => line.startsWith(`REQUEST https://api.github.com/repos/${fixedRepository}/issues/123`))).toBe(true);
    expect(result.stdout).toContain('"status":"alert-checked"');
    expect(result.stdout).not.toContain('syntheticInstallationForRuntimeTest');
  });
});
