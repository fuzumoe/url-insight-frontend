import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  formatUrl,
  formatNumber,
  formatFileSize,
  truncateText,
  formatStatus,
} from '../formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      expect(formatDate('2025-07-14')).toBe('July 14, 2025');
    });

    it('returns empty string for falsy values', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });

    it('accepts custom format options', () => {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      } as Intl.DateTimeFormatOptions;

      expect(formatDate('2025-07-14', options)).toBe('Jul 14, 2025');
    });

    it('returns original string on error', () => {
      console.error = vi.fn(); // Mock console.error
      expect(formatDate('invalid-date')).toBe('invalid-date');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock Date.now to return a fixed date
      const nowDate = new Date('2025-07-14T12:00:00Z');
      vi.spyOn(Date, 'now').mockImplementation(() => nowDate.getTime());
      vi.useFakeTimers();
      vi.setSystemTime(nowDate);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('formats seconds ago', () => {
      const date = new Date('2025-07-14T11:59:30Z');
      expect(formatRelativeTime(date.toISOString())).toBe('30 seconds ago');
    });

    it('formats minutes ago', () => {
      const date = new Date('2025-07-14T11:55:00Z');
      expect(formatRelativeTime(date.toISOString())).toBe('5 minutes ago');
    });

    it('formats hours ago', () => {
      const date = new Date('2025-07-14T09:00:00Z');
      expect(formatRelativeTime(date.toISOString())).toBe('3 hours ago');
    });

    it('formats days ago', () => {
      const date = new Date('2025-07-11T12:00:00Z');
      expect(formatRelativeTime(date.toISOString())).toBe('3 days ago');
    });

    it('falls back to formatDate for older dates', () => {
      const date = new Date('2025-01-01T12:00:00Z');
      expect(formatRelativeTime(date.toISOString())).toBe('January 1, 2025');
    });

    it('returns empty string for falsy values', () => {
      expect(formatRelativeTime('')).toBe('');
    });
  });

  describe('formatUrl', () => {
    it('removes protocol and www prefix', () => {
      expect(formatUrl('https://www.example.com')).toBe('example.com');
      expect(formatUrl('http://example.com')).toBe('example.com');
    });

    it('truncates long URLs', () => {
      const longUrl =
        'example.com/very/long/path/that/exceeds/the/maximum/length/limit';
      expect(formatUrl(longUrl, 20)).toBe('example.com/very/...');
    });

    it('returns original URL if no modification needed', () => {
      expect(formatUrl('example.com')).toBe('example.com');
    });

    it('returns empty string for falsy values', () => {
      expect(formatUrl('')).toBe('');
      expect(formatUrl(null as any)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('adds thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    it('returns empty string for null/undefined', () => {
      expect(formatNumber(null as any)).toBe('');
      expect(formatNumber(undefined as any)).toBe('');
    });

    it('returns number as string on error', () => {
      console.error = vi.fn();
      const formatError = new Error('Format error');
      const mockIntl = {
        format: vi.fn().mockImplementation(() => {
          throw formatError;
        }),
      };
      vi.spyOn(Intl, 'NumberFormat').mockImplementation(() => mockIntl as any);

      expect(formatNumber(1234)).toBe('1234');
      expect(console.error).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('respects decimal places parameter', () => {
      expect(formatFileSize(1536, 0)).toBe('2 KB');
      expect(formatFileSize(1536, 1)).toBe('1.5 KB');
      expect(formatFileSize(1536, 3)).toBe('1.5 KB');
    });
  });

  describe('truncateText', () => {
    it('truncates text that exceeds max length', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very lo...');
    });

    it('returns original text if within max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('returns empty string for falsy values', () => {
      expect(truncateText('')).toBe('');
      expect(truncateText(null as any)).toBe('');
    });
  });

  describe('formatStatus', () => {
    it('capitalizes first letter and lowercases the rest', () => {
      expect(formatStatus('pending')).toBe('Pending');
      expect(formatStatus('COMPLETED')).toBe('Completed');
      expect(formatStatus('In_PROGRESS')).toBe('In_progress');
    });

    it('returns empty string for falsy values', () => {
      expect(formatStatus('')).toBe('');
      expect(formatStatus(null as any)).toBe('');
    });
  });
});
