import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns health status', () => {
    expect(new HealthController().health()).toEqual({ status: 'ok' });
  });
});
