export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateRegistration({ username, email, password, displayName }) {
  if (!username || !validateUsername(username)) {
    return { valid: false, error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' };
  }

  if (!email || !validateEmail(email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!password || !validatePassword(password)) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  if (!displayName || displayName.trim().length < 1) {
    return { valid: false, error: 'Display name is required' };
  }

  return { valid: true };
}

export function validateLogin({ email, password }) {
  if (!email || !validateEmail(email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  return { valid: true };
}

export function sanitizeString(str) {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
}