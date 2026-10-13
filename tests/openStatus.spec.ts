import { test, expect } from '@playwright/test';
import { computeIsOpen, isHoursNoteCurrent } from '../src/utils/openStatus';

const cases: [string, string, boolean][] = [
  ['before Wednesday opening', '2026-10-14T17:59:00Z', false],
  ['Wednesday opening', '2026-10-14T18:00:00Z', true],
  ['before Wednesday closing', '2026-10-14T20:59:00Z', true],
  ['Wednesday closing', '2026-10-14T21:00:00Z', false],
  ['Thursday evening', '2026-10-15T18:30:00Z', true],
  ['Monday evening', '2026-10-12T18:30:00Z', false],
  ['Tuesday evening', '2026-10-13T18:30:00Z', false],
  ['before Friday opening', '2026-10-09T15:59:00Z', false],
  ['Friday opening', '2026-10-09T16:00:00Z', true],
  ['Saturday on an open weekend', '2026-10-10T17:00:00Z', true],
  ['Sunday on an open weekend', '2026-10-11T17:00:00Z', true],
  ['Friday closing', '2026-10-09T21:00:00Z', false],
  ['Friday on a closed weekend', '2026-10-16T17:00:00Z', false],
  ['Saturday on a closed weekend', '2026-10-17T17:00:00Z', false],
  ['Sunday on a closed weekend', '2026-10-18T17:00:00Z', false],
  ['before winter opening', '2026-12-02T18:59:00Z', false],
  ['winter opening', '2026-12-02T19:00:00Z', true],
  ['winter closing', '2026-12-02T22:00:00Z', false],
  ['open Sunday after autumn clock change', '2026-10-25T17:00:00Z', true],
  ['before opening after autumn clock change', '2026-10-25T16:59:00Z', false],
  ['open Sunday after spring clock change', '2026-03-29T16:00:00Z', true],
  ['before opening after spring clock change', '2026-03-29T15:59:00Z', false],
  ['Wednesday after spring clock change', '2026-04-01T18:00:00Z', true],
  ['open weekend before anchor', '2025-09-26T17:00:00Z', true],
  ['closed weekend before anchor', '2025-10-03T17:00:00Z', false],
];

for (const zone of ['Europe/London', 'America/New_York', 'Asia/Tokyo']) {
  test(`schedule is correct in ${zone}`, () => {
    const previousZone = process.env.TZ;
    process.env.TZ = zone;
    try {
      for (const [name, instant, expected] of cases) {
        expect(computeIsOpen(new Date(instant), 'auto'), name).toBe(expected);
      }
    } finally {
      if (previousZone === undefined) delete process.env.TZ;
      else process.env.TZ = previousZone;
    }
  });
}

test('hours notes expire at London midnight after their final date', () => {
  expect(isHoursNoteCurrent(new Date('2026-10-14T22:59:00Z'), '2026-10-14')).toBe(true);
  expect(isHoursNoteCurrent(new Date('2026-10-14T23:00:00Z'), '2026-10-14')).toBe(false);
  expect(isHoursNoteCurrent(new Date('2026-12-02T23:59:00Z'), '2026-12-02')).toBe(true);
  expect(isHoursNoteCurrent(new Date('2026-12-03T00:00:00Z'), '2026-12-02')).toBe(false);
  expect(isHoursNoteCurrent(new Date('2026-10-14T23:00:00Z'), '')).toBe(true);
});

test('manual overrides take precedence over the schedule', () => {
  expect(computeIsOpen(new Date('2026-10-12T12:00:00Z'), 'open')).toBe(true);
  expect(computeIsOpen(new Date('2026-10-14T18:30:00Z'), 'closed')).toBe(false);
});
