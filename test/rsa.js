// Import the jsrsasign library
const KJUR = require('jsrsasign');

// Generate a new RSA key pair
const key = KJUR.KEYUTIL.generateKeypair('RSA', 1024);

// Get the public key
const publicKey = KJUR.KEYUTIL.getPEM(key.pubKeyObj);

// Get the private key
const privateKey = KJUR.KEYUTIL.getPEM(key.prvKeyObj, 'PKCS8PRV');

// Encrypt a message using the public key
const message = 'Hello, world!';
const encryptedMessage = KJUR.crypto.Cipher.encrypt(message, key.pubKeyObj, 'RSAOAEP');

// Decrypt the message using the private key
const decryptedMessage = KJUR.crypto.Cipher.decrypt(encryptedMessage, key.prvKeyObj, 'RSAOAEP');

// Output the decrypted message

console.log(encryptedMessage); // Hello, world!
console.log(decryptedMessage); // Hello, world!
