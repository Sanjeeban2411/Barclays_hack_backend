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
const privateKey = response.privateKeyJson;
const publicKey = response.publicKeyJson;
// console.log(response.publicKeyJson.g)


// const publicKey = new paillier.PublicKey(
//   response.publicKeyJson.n,
//   response.publicKeyJson._n,
//   response.publicKeyJson.g
// );

// console.log(publicKey)

// const privateKey = new paillier.PrivateKey(
//   BigInt(JSON.parse(privateKeyJson).lambda),
//   BigInt(JSON.parse(privateKeyJson).mu),
//   BigInt(JSON.parse(privateKeyJson)._p),
//   (BigInt(JSON.parse(privateKeyJson)._q)), 
//   publicKey
// );

// console.log(publicKey, privateKey)

// // let a = BigInt(40);
// // let b = BigInt(100);

// //   // a = a*(-1)
// // const a1 = publicKey.encrypt(a);
// // const b1 = publicKey.encrypt(b);

// //   console.log("A1", a1)
// //   console.log("B1", b1)

// //   const decryptedA = privateKey.decrypt(BigInt(a1));
// //   const decryptedB = privateKey.decrypt(BigInt(b1));
  
// //   console.log(decryptedA);
// //   console.log(decryptedB);
