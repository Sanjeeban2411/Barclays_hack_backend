
// const bigInt = require("big-integer");

// // Function to generate Paillier key pair using provided p and q values
// function generatePaillierKeys(p, q) {
//   const n = p.multiply(q); // Calculate n = p*q
//   const nSquare = n.pow(2); // Calculate n^2
//   const lambda = p.subtract(1).multiply(q.subtract(1)); // Calculate lambda = (p-1)*(q-1)
//   const g = n.add(1); // Calculate g = n+1

//   // Find the multiplicative inverse of lambda mod n
//   const lambdaInverse = lambda.modInv(n);

//   const publicKey = {
//     n: n,
//     g: g
//   };

//   const privateKey = {
//     lambda: lambda,
//     lambdaInverse: lambdaInverse,
//     mu: null
//   };

//   return { publicKey, privateKey };
// }

// // Function to encrypt a plaintext message using the provided public key
// function encrypt(plaintext, publicKey) {
//   // Generate random r where 1 < r < n
//   const n = publicKey.n;
//   const r = bigInt.randBetween(2, n);

//   // Compute ciphertext c = (g^m * r^n) mod n^2
//   const g = publicKey.g;
//   const m = bigInt(plaintext);
//   const nSquare = n.pow(2);
//   const c = g.modPow(m, nSquare).multiply(r.modPow(n, nSquare)).mod(nSquare);

//   return c;
// }

// // Function to decrypt a ciphertext message using the provided private key
// function decrypt(ciphertext, privateKey, publicKey) {
//   // Compute L(c^lambda mod n^2) * mu mod n where L(u) = (u-1)/n
//   const n = publicKey.n;
//   const nSquare = n.pow(2);
//   const lambda = privateKey.lambda;
//   const c = bigInt(ciphertext);
//   const u = c.modPow(lambda, nSquare);
//   const L = u.subtract(1).divide(n);
//   const plaintext = L.multiply(privateKey.lambdaInverse).mod(n);

//   return plaintext;
// }

// // Sample usage
// const p = bigInt('249648371182514337598784609118416484225');
// const q = bigInt('247590190720139947393125810692364900807');
// const { publicKey, privateKey } = generatePaillierKeys(p, q);

// const plaintext = '123';
// const ciphertext = encrypt(plaintext, publicKey);
// console.log('Ciphertext:', ciphertext.toString());

// const decryptedPlaintext = decrypt(ciphertext, privateKey, publicKey);
// console.log('Decrypted plaintext:', decryptedPlaintext.toString());

// const paillier = require("paillier-bigint");

// // // Generate a new key pair
// // const { publicKey, privateKey } = paillier.generateRandomKeys(1024);

// // // Encrypt a message
// // const plaintext = BigInt(42);
// // const ciphertext = publicKey.encrypt(plaintext);

// // // Decrypt the ciphertext
// // const decrypted = privateKey.decrypt(ciphertext);

// // console.log(`Plaintext: ${plaintext}`);
// // console.log(`Ciphertext: ${ciphertext}`);
// // console.log(`Decrypted: ${decrypted}`);
// async function paillierTest(req, res) {
//   const publicKey = new paillier.PublicKey(
//     4090067279n,
//     16728650346746463841n,
//     10053101120642783828n
//   );
//   console.log(publicKey)
//   const plaintext = BigInt(42);
  
// //   if (plaintext >= publicKey.n) {
// //     throw new Error("Plaintext value is too large for encryption");
// //   }
//   const ciphertext = publicKey.encrypt(plaintext);


//   console.log(`Plaintext: ${plaintext}`);
//   console.log(`Ciphertext: ${ciphertext}`);
// }
// paillierTest();

const paillier = require("paillier-bigint");

async function paillierTest(req, res) {
  const publicKey = new paillier.PublicKey(
    4090067279n,
    16728650346746463841n,
    10053101120642783828n
  );

  console.log(publicKey);

  const plaintext = 42n;
  const ciphertext = publicKey.encryptBigint'use strict';
  const crypto = require('crypto');
  const bigInt = require('big-integer');
  
  bigInt.rand = function (bitLength) {
      let bytes = bitLength / 8;
      let buf = Buffer.alloc(bytes);
      crypto.randomFillSync(buf);
      buf[0] = buf[0] | 128;  // first bit to 1 -> to get the necessary bitLength
      return bigInt.fromArray([...buf], 256);
  };
  
  bigInt.randBetween = function (start, end) {  // crypto rand in [start, end]
      let interval = end.subtract(start);
      let arr = interval.toArray(256).value;
      let buf = Buffer.alloc(arr.length);
      let bn;
      do {
          crypto.randomFillSync(buf);
          bn = bigInt.fromArray([...buf], 256).add(start);
      } while (bn.compare(end) >= 0 || bn.compare(start) < 0);
      return bn;
  };
  
  bigInt.prime = function (bitLength) {
      let rnd;
      do {
          rnd = bigInt.rand(bitLength);
          console.assert(rnd.bitLength() == bitLength, 'ERROR: ' + rnd.bitLength() + ' != ' + bitLength);
      } while (!rnd.isPrime());
      return bigInt(rnd);
  };
  
  bigInt.prototype.bitLength = function () {
      let bits = 1;
      let result = this;
      const two = bigInt(2);
      while (result.greater(bigInt.one)) {
          result = result.divide(two);
          bits++;
      }
      return bits;
  };
  
  const generateRandomKeys = function (bitLength = 2048, simplevariant = false) {
      let p, q, n, phi, n2, g, lambda, mu;
      // if p and q are bitLength/2 long ->  2**(bitLength - 2) <= n < 2**(bitLenght) 
      do {
          p = bigInt.prime(bitLength / 2);
          q = bigInt.prime(bitLength / 2);
          n = p.multiply(q);
      } while (q.compare(p) == 0 || n.bitLength() != bitLength);
  
      phi = p.subtract(1).multiply(q.subtract(1));
  
      n2 = n.pow(2);
  
      if (simplevariant === true) {
          //If using p,q of equivalent length, a simpler variant of the key
          // generation steps would be to set
          // g=n+1, lambda=(p-1)(q-1), mu=lambda.modInv(n)
          g = n.add(1);
          lambda = phi;
          mu = lambda.modInv(n);
      } else {
          g = getGenerator(n, n2);
          lambda = bigInt.lcm(p.subtract(1), q.subtract(1));
          mu = L(g.modPow(lambda, n2), n).modInv(n);
      }
  
      const publicKey = new PaillierPublicKey(n, g);
      const privateKey = new PaillierPrivateKey(lambda, mu, p, q, publicKey);
      return { publicKey: publicKey, privateKey: privateKey };
  };
  
  const PaillierPublicKey = class PaillierPublicKey {
      constructor(n, g) {
          this.n = bigInt(n);
          this._n2 = this.n.pow(2); // cache n^2
          this.g = bigInt(g);
      }
      get bitLength() {
          return this.n.bitLength();
      }
      encrypt(m) {
          let r;
          do {
              r = bigInt.randBetween(2, this.n);
          } while (r.leq(1));
          return this.g.modPow(bigInt(m), this._n2).multiply(r.modPow(this.n, this._n2)).mod(this._n2);
      }
      addition(...ciphertexts) {
          return ciphertexts.reduce((sum, next) => sum.multiply(bigInt(next)).mod(this._n2), bigInt(1));
      }
      multiply(c, k) { // c is ciphertext. k is a number
          return bigInt(c).modPow(k, this._n2);
      }
  };
  
  const PaillierPrivateKey = class PaillierPrivateKey {
      constructor(lambda, mu, p, q, publicKey) {
          this.lambda = bigInt(lambda);
          this.mu = bigInt(mu);
          this._p = bigInt(p);
          this._q = bigInt(q);
          this.publicKey = publicKey;
      }
      get bitLength() {
          return this.publicKey.n.bitLength();
      }
      get n() {
          return this.publicKey.n;
      }
      decrypt(c) {
          return L(bigInt(c).modPow(this.lambda, this.publicKey._n2), this.publicKey.n).multiply(this.mu).mod(this.publicKey.n);
      }
  };
  
  function L(a, n) {
      return a.subtract(1).divide(n);
  }
  
  function getGenerator(n, n2 = n.pow(2)) {
      const alpha = bigInt.randBetween(2, n);
      const beta = bigInt.randBetween(2, n);
      return alpha.multiply(n).add(1).multiply(beta.modPow(n, n2)).mod(n2);
  }
  
  module.exports = {
      generateRandomKeys: generateRandomKeys,
      PrivateKey: PaillierPrivateKey,
      PublicKey: PaillierPublicKey
  };(plaintext);

  console.log(`Plaintext: ${plaintext}`);
  console.log(`Ciphertext: ${ciphertext}`);
}

paillierTest();

