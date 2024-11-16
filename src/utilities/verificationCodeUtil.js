import crypto from 'crypto';

const generateVerificationCode = (expiryDate, data) => {
  const secret = crypto.randomBytes(8).toString('hex');
  const tokenObject = { secret, expiryDate, data };
  return Buffer.from(JSON.stringify(tokenObject)).toString('base64');
};

const decodeVerificationCode = (code) =>
  Buffer.from(code, 'base64').toString('ascii');

export { generateVerificationCode, decodeVerificationCode };
