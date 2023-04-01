const paillier = require("paillier-bigint");

const response = {
    "privateKeyJson": {
      "lambda": "4086318441822752352",
      "mu": "10115890722199952651",
      "_p": "5376081797",
      "_q": "3040369249"
    },
    "publicKeyJson": {
      "n": "16345273775707460453",
      "_n2": "267167974802830020204041540442558965209",
      "g": "33447271224577937457177158579611875301"
    }
}

function convertToBigInt(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = BigInt(obj[key]);
      } else if (typeof obj[key] === 'object') {
        convertToBigInt(obj[key]);
      }
    }
  }
  
convertToBigInt(response);
  

// console.log(response)
const privateKeyJson = response.privateKeyJson;
const publicKeyJson = response.publicKeyJson;
// console.log(response.publicKeyJson.g)

const publicKey = new paillier.PublicKey(publicKeyJson.n, publicKeyJson.g)
const privateKey = new paillier.PrivateKey(privateKeyJson.lambda, privateKeyJson.mu, publicKey, privateKeyJson._p, privateKeyJson._q )


let a = -40;
let b = 100;


const a1 = publicKey.encrypt(a);
console.log("a1 :", a1)
// const b1 = publicKey.encrypt(b);



// const sum = publicKey.addition(a1, b1)
// console.log(sum)


const decryptedA = privateKey.decrypt(a1);

  
  console.log(decryptedA);
// //   console.log(decryptedB);
