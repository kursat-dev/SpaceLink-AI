/**
 * Escapes special regex characters in a string to prevent ReDoS attacks.
 * Use this whenever user input is passed into a RegExp constructor.
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for use in RegExp
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { escapeRegExp };
