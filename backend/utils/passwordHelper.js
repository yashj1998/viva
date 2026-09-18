const crypto = require('crypto');

/**
 * Hash a plain-text password using PBKDF2 with a cryptographic salt
 * @param {string} password 
 * @returns {{ hash: string, salt: string }}
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a plain-text password against stored hash and salt
 * @param {string} password 
 * @param {string} storedHash 
 * @param {string} storedSalt 
 * @returns {boolean}
 */
function verifyPassword(password, storedHash, storedSalt) {
  if (!password || !storedHash || !storedSalt) return false;
  const hashToVerify = crypto.pbkdf2Sync(password, storedSalt, 10000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hashToVerify, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch (e) {
    return hashToVerify === storedHash;
  }
}

module.exports = {
  hashPassword,
  verifyPassword
};
