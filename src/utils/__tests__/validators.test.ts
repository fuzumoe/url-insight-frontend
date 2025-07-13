import { describe, it, expect } from 'vitest';
import {
  isValidUrl,
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isValidUsername,
  isRequired,
  isMinLength,
  isMaxLength,
  isNumeric,
  isAlpha,
  isAlphanumeric,
} from '../validators';

describe('Validators', () => {
  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://sub.example.com/path?query=string')).toBe(
        true
      );
    });

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('example.com')).toBe(false); // Missing protocol
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false); // Not http/https
    });

    it('returns false for empty values', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null as any)).toBe(false);
      expect(isValidUrl(undefined as any)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('a@b.c')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test.example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });

    it('returns false for empty values', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('returns true for valid passwords', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('Secure456Password')).toBe(true);
    });

    it('returns false for passwords without required complexity', () => {
      expect(isValidPassword('password123')).toBe(false); // No uppercase
      expect(isValidPassword('PASSWORD123')).toBe(false); // No lowercase
      expect(isValidPassword('Passwordabc')).toBe(false); // No number
    });

    it('returns false for passwords shorter than minimum length', () => {
      expect(isValidPassword('Pass1')).toBe(false); // Shorter than 8
      expect(isValidPassword('Pass1', 5)).toBe(false); // Shorter than 5
    });

    it('respects custom minimum length', () => {
      expect(isValidPassword('Pass1', 5)).toBe(false); // Has complexity but too short
      expect(isValidPassword('Pass12', 5)).toBe(true); // Has complexity and meets min length 5
    });

    it('returns false for empty values', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword(null as any)).toBe(false);
      expect(isValidPassword(undefined as any)).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('returns "weak" for short or simple passwords', () => {
      expect(getPasswordStrength('')).toBe('weak');
      expect(getPasswordStrength('short')).toBe('weak');
      expect(getPasswordStrength('password')).toBe('weak');
    });

    it('returns "medium" for moderately complex passwords', () => {
      expect(getPasswordStrength('Password1')).toBe('medium');
      expect(getPasswordStrength('Simple123')).toBe('medium');
    });

    it('returns "strong" for complex passwords', () => {
      expect(getPasswordStrength('SuperComplex123!')).toBe('strong');
      expect(getPasswordStrength('Unique@Password#987')).toBe('strong');
    });
  });

  describe('isValidUsername', () => {
    it('returns true for valid usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('dev-123')).toBe(true);
    });

    it('returns false for usernames with invalid characters', () => {
      expect(isValidUsername('user name')).toBe(false); // Space not allowed
      expect(isValidUsername('user@123')).toBe(false); // @ not allowed
      expect(isValidUsername('user.name')).toBe(false); // . not allowed
    });

    it('returns false for usernames outside length requirements', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short (min 3)
      expect(isValidUsername('a'.repeat(21))).toBe(false); // Too long (max 20)
    });

    it('returns false for empty values', () => {
      expect(isValidUsername('')).toBe(false);
      expect(isValidUsername(null as any)).toBe(false);
      expect(isValidUsername(undefined as any)).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('returns true for non-empty values', () => {
      expect(isRequired('text')).toBe(true);
      expect(isRequired(123)).toBe(true);
      expect(isRequired({ key: 'value' })).toBe(true);
      expect(isRequired([1, 2, 3])).toBe(true);
      expect(isRequired(true)).toBe(true);
      expect(isRequired(false)).toBe(true);
    });

    it('returns false for empty values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false); // Whitespace only
      expect(isRequired({})).toBe(false);
      expect(isRequired([])).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('isMinLength', () => {
    it('returns true when string meets minimum length', () => {
      expect(isMinLength('12345', 5)).toBe(true);
      expect(isMinLength('12345', 3)).toBe(true);
    });

    it('returns false when string is shorter than minimum', () => {
      expect(isMinLength('123', 5)).toBe(false);
      expect(isMinLength('', 1)).toBe(false);
    });

    it('returns false for empty values', () => {
      expect(isMinLength('', 5)).toBe(false);
      expect(isMinLength(null as any, 5)).toBe(false);
      expect(isMinLength(undefined as any, 5)).toBe(false);
    });
  });

  describe('isMaxLength', () => {
    it('returns true when string meets maximum length', () => {
      expect(isMaxLength('12345', 5)).toBe(true);
      expect(isMaxLength('123', 5)).toBe(true);
    });

    it('returns false when string exceeds maximum', () => {
      expect(isMaxLength('123456', 5)).toBe(false);
    });

    it('returns true for empty values', () => {
      expect(isMaxLength('', 5)).toBe(true);
      expect(isMaxLength(null as any, 5)).toBe(true);
      expect(isMaxLength(undefined as any, 5)).toBe(true);
    });
  });

  describe('isNumeric', () => {
    it('returns true for numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('returns false for non-numeric strings', () => {
      expect(isNumeric('123a')).toBe(false);
      expect(isNumeric('12.3')).toBe(false); // Decimal point
      expect(isNumeric('-123')).toBe(false); // Negative sign
    });

    it('returns false for empty values', () => {
      expect(isNumeric('')).toBe(false);
      expect(isNumeric(null as any)).toBe(false);
      expect(isNumeric(undefined as any)).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('returns true for alphabetic strings', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('abcDEF')).toBe(true);
    });

    it('returns false for non-alphabetic strings', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('abc ')).toBe(false); // Space
      expect(isAlpha('abc-def')).toBe(false); // Hyphen
    });

    it('returns false for empty values', () => {
      expect(isAlpha('')).toBe(false);
      expect(isAlpha(null as any)).toBe(false);
      expect(isAlpha(undefined as any)).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('returns true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
      expect(isAlphanumeric('abc')).toBe(true);
    });

    it('returns false for non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc 123')).toBe(false); // Space
      expect(isAlphanumeric('abc-123')).toBe(false); // Hyphen
      expect(isAlphanumeric('abc_123')).toBe(false); // Underscore
    });

    it('returns false for empty values', () => {
      expect(isAlphanumeric('')).toBe(false);
      expect(isAlphanumeric(null as any)).toBe(false);
      expect(isAlphanumeric(undefined as any)).toBe(false);
    });
  });
});
