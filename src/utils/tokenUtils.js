const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates a JWT token for a given payload.
 * @param {Object} payload - The payload to include in the token.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
};

module.exports = { generateToken };