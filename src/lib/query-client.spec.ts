import { ApiError } from '@/lib/api/api-error';

import { shouldRetryQuery } from './query-client';

describe('shouldRetryQuery', () => {
  it('never retries a 4xx', () => {
    const error = new ApiError({ status: 404, code: 'NOT_FOUND', message: 'Not found' });
    expect(shouldRetryQuery(0, error)).toBe(false);
  });

  it('retries network and server errors twice', () => {
    const error = new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'offline' });
    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });
});
