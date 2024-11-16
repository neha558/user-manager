import crypto from 'crypto';
import config from 'config';

/**
 *
 * @param {string} cursor
 */
const encodeCursor = (cursor) =>
  Buffer.from(cursor.toString()).toString('base64');

/**
 *
 * @param {string} encodedCursor
 */
const decodeCursor = (encodedCursor) =>
  Buffer.from(encodedCursor, 'base64').toString('ascii');

// This utility is not encrypting any sensitive data we are only encrypting
// cursors so that no one peeks at the info inside cursor to send incorrect
// get request, change in key would not cause issues and is not required
// hence a constant key
const algorithm = 'aes-256-ctr';
const secretKey = config
  .get('cursorEncryptionSecret')
  .toString()
  .trim();

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final(),
  ]);
  const encryptedDetails = {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
  return encodeCursor(
    `${encryptedDetails.iv}&${encryptedDetails.content}`,
  );
};

const decrypt = (hash) => {
  const cursor = decodeCursor(hash);

  const [iv, content] = cursor.split('&');

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex'),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString();
};

export { encodeCursor, decodeCursor, encrypt, decrypt };
