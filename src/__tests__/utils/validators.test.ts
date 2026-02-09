import {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  validatePasswordMatch,
  validateMessage,
} from '../../utils/validators';

describe('validateEmail', () => {
  test('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('rejects empty email', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('rejects invalid email format', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  test('accepts strong password', () => {
    const result = validatePassword('StrongPass1!');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  test('rejects empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.message).toBeTruthy();
  });

  test('rejects short password', () => {
    const result = validatePassword('Ab1!');
    expect(result.valid).toBe(false);
  });

  test('rejects password without uppercase', () => {
    const result = validatePassword('lowercase1!');
    expect(result.valid).toBe(false);
  });

  test('rejects password without number', () => {
    const result = validatePassword('NoNumberHere!');
    expect(result.valid).toBe(false);
  });
});

describe('validateName', () => {
  test('accepts valid name', () => {
    expect(validateName('John')).toBe(true);
  });

  test('rejects empty name', () => {
    expect(validateName('')).toBe(false);
  });

  test('rejects short name', () => {
    expect(validateName('J')).toBe(false);
  });
});

describe('validateRequired', () => {
  test('accepts non-empty value', () => {
    expect(validateRequired('some value')).toBe(true);
  });

  test('rejects empty value', () => {
    expect(validateRequired('')).toBe(false);
  });

  test('rejects whitespace-only value', () => {
    expect(validateRequired('   ')).toBe(false);
  });
});

describe('validatePasswordMatch', () => {
  test('passes when passwords match', () => {
    expect(validatePasswordMatch('password123', 'password123')).toBe(true);
  });

  test('fails when passwords do not match', () => {
    expect(validatePasswordMatch('password123', 'different')).toBe(false);
  });
});

describe('validateMessage', () => {
  test('accepts valid message', () => {
    expect(validateMessage('This is a valid message with enough characters')).toBe(true);
  });

  test('rejects empty message', () => {
    expect(validateMessage('')).toBe(false);
  });

  test('rejects short message', () => {
    expect(validateMessage('Hi')).toBe(false);
  });
});
