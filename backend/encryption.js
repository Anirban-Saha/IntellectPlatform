const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'projectintellectdeptofit20192023';

const hash = (text) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(text, salt, 1000, 64, `sha512`).toString(`hex`);
    return {salt, hash};
};

const hashPass = (text, salt) => {
    const hash = crypto.pbkdf2Sync(text, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash;
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

module.exports = {
    hash, decrypt, hashPass, encrypt
};