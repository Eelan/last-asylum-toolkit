import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fromDateTimeInput,
  toDateTimeInput,
  formatDateTime,
  formatTimeWindow,
  getServerWeekdayDate
} from '../src/lib/core/time.js';
import { getStoredStock, setStoredStock } from '../src/lib/core/storage.js';
import { readPreference, writePreference } from '../src/lib/platform/storage.ts';

process.env.TZ = 'Europe/Paris';
test('Server/local dates cross midnight and preserve the same timer instant', () => {
  const instant = new Date('2026-09-06T23:30:00Z');
  assert.equal(toDateTimeInput(instant, 'server'), '2026-09-06T21:30');
  assert.equal(toDateTimeInput(instant, 'local'), '2026-09-07T01:30');
  for (const mode of ['server', 'local'])
    assert.equal(
      fromDateTimeInput(toDateTimeInput(instant, mode), mode).toISOString(),
      instant.toISOString()
    );
  assert.match(formatDateTime(instant, 'server', 'en-GB'), /06\/09\/2026/);
  assert.match(formatDateTime(instant, 'local', 'en-GB'), /07\/09\/2026/);
  assert.match(formatTimeWindow(instant, new Date('2026-09-07T03:00:00Z'), 'server', 'en-GB'), /Sun.*Mon/);
  assert.match(formatTimeWindow(instant, new Date('2026-09-07T03:00:00Z'), 'local', 'en-GB'), /^Mon/);
  assert.equal(
    getServerWeekdayDate(1, 0, new Date('2026-09-09T12:00:00Z')).toISOString(),
    '2026-09-07T02:00:00.000Z'
  );
});
test('Stock aliases migrate and remain available without browser storage', () => {
  writePreference('lat-stock-ur-shards', '123');
  assert.equal(getStoredStock('ur-omni-shards'), '123');
  assert.equal(readPreference('lat-stock-ur-omni-shards'), '123');
  setStoredStock('antitoxin', '900');
  assert.equal(getStoredStock('antitoxin'), '900');
});
