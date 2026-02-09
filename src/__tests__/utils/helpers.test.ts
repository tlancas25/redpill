import {
  formatPrice,
  formatDate,
  calculateReadTime,
  truncateText,
  slugify,
  formatDuration,
  getProgressPercentage,
  debounce,
} from '../../utils/helpers';

describe('formatPrice', () => {
  test('formats number as USD currency', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  test('formats whole numbers', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  test('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});

describe('truncateText', () => {
  test('truncates text longer than maxLength', () => {
    const text = 'This is a very long string that should be truncated';
    const result = truncateText(text, 20);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  test('does not truncate text shorter than maxLength', () => {
    const text = 'Short text';
    expect(truncateText(text, 50)).toBe(text);
  });
});

describe('slugify', () => {
  test('converts text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('removes special characters', () => {
    expect(slugify('Hello, World! How are you?')).toBe('hello-world-how-are-you');
  });

  test('trims leading/trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });
});

describe('calculateReadTime', () => {
  test('calculates read time for short text', () => {
    const text = Array(200).fill('word').join(' '); // 200 words
    expect(calculateReadTime(text)).toBe(1);
  });

  test('calculates read time for longer text', () => {
    const text = Array(600).fill('word').join(' '); // 600 words
    expect(calculateReadTime(text)).toBe(3);
  });
});

describe('formatDuration', () => {
  test('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  test('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  test('formats exact hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });
});

describe('getProgressPercentage', () => {
  test('calculates correct percentage', () => {
    expect(getProgressPercentage(['a', 'b', 'c', 'd', 'e'], 10)).toBe(50);
  });

  test('handles zero total', () => {
    expect(getProgressPercentage([], 0)).toBe(0);
  });

  test('handles 100%', () => {
    expect(getProgressPercentage(['a', 'b', 'c'], 3)).toBe(100);
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  test('delays function execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('resets timer on subsequent calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
