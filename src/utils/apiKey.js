const { randomBytes, scryptSync, timingSafeEqual } = require('crypto');

function generateKey(size = 32, format = 'base64') {
    const buffer = randomBytes(size);
    return "owenapi_" + buffer.toString(format); // Start API key with owenapi_ to make it easier to identify
}

function generateSecretHash(key) {
    const salt = randomBytes(8).toString('hex');
    const buffer = scryptSync(key, salt, 64);
    return `${buffer.toString('hex')}.${salt}`;
}

function compareKeys(storedKey, providedKey) {
    const [hash, salt] = storedKey
        .slice('owen_'.length) //Remove owen_ from the start of the hash
        .split('.');
    const buffer = scryptSync(providedKey, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), buffer);
}

module.exports = {generateKey, generateSecretHash, compareKeys};