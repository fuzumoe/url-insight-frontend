export const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    // Check if the URL is valid by trying to construct a URL object
    new URL(url);

    // Additional check for http/https protocol
    return /^https?:\/\//i.test(url);
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;

  // Email regex with required TLD (requires at least one dot in domain part)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (
  password: string,
  minLength: number = 8
): boolean => {
  if (!password) return false;

  // Check if password length is strictly greater than minLength
  if (password.length <= minLength) return false;

  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
};

export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  if (!password || password.length < 8) return 'weak';

  let score = 0;

  // Length check
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Variety checks
  const uniqueChars = new Set(password).size;
  if (uniqueChars > 7) score += 1;

  // Adjusted thresholds - require higher score for "strong"
  if (score >= 6) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
};

export const isValidUsername = (username: string): boolean => {
  if (!username) return false;

  // Username should be 3-20 characters and only contain letters, numbers, underscores, or hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const isMinLength = (value: string, minLength: number): boolean => {
  if (!value) return false;
  return value.length >= minLength;
};

export const isMaxLength = (value: string, maxLength: number): boolean => {
  if (!value) return true; // Empty values pass max length check
  return value.length <= maxLength;
};

export const isNumeric = (value: string): boolean => {
  if (!value) return false;
  return /^[0-9]+$/.test(value);
};

export const isAlpha = (value: string): boolean => {
  if (!value) return false;
  return /^[a-zA-Z]+$/.test(value);
};

export const isAlphanumeric = (value: string): boolean => {
  if (!value) return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};
