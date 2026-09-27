import { bandCountsLine, ingredientsFoundTitle, processingStages, resultsBack } from './scan-flow';

jest.mock('expo-router', () => ({ router: {} }));

describe('processingStages', () => {
  const labels = (online: boolean, pack: 'none' | 'small' | 'medium' | 'large'): string[] =>
    processingStages({ online, pack }).map((stage) => stage.label);

  it('online: detect, check, write the summary', () => {
    expect(labels(true, 'none')).toEqual(['Detecting ingredients', 'Checking what they are', 'Writing your summary']);
  });

  it('offline with data: detect, then check the offline data', () => {
    expect(labels(false, 'small')).toEqual(['Detecting ingredients', 'Checking your offline data']);
  });

  it('offline without data: detect only', () => {
    expect(labels(false, 'none')).toEqual(['Detecting ingredients']);
  });
});

describe('results helpers', () => {
  it('backs to where the results were opened from, Home by default', () => {
    expect(resultsBack('history')).toEqual({ label: 'History', route: '/(tabs)/history' });
    expect(resultsBack(undefined)).toEqual({ label: 'Home', route: '/(tabs)' });
    expect(resultsBack('elsewhere')).toEqual({ label: 'Home', route: '/(tabs)' });
  });

  it('writes the title and the counts line', () => {
    expect(ingredientsFoundTitle(5)).toBe('5 ingredients found');
    expect(ingredientsFoundTitle(1)).toBe('1 ingredient found');
    expect(bandCountsLine({ detected: 3, likely: 0, uncertain: 1 })).toBe('3 detected, 1 uncertain');
  });
});
