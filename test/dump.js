const paillier = require("paillier-bigint");
// const express = require("express");
// // const ngrok = require("ngrok");

// const app = express();

// // (async function () {
// //   const url = await ngrok.connect();
// // })();

// app.get("/generatekeys", async function paillierTest(req, res) {
//   // async function paillierTest(req, res) {
//   const { publicKey, privateKey } = await paillier.generateRandomKeys(64);
//   const pub = publicKey;
//   const pvt = {
//     lambda: privateKey.lambda,
//     mu: privateKey.mu,
//     _p: privateKey._p,
//     _q: privateKey._q,
//   };
//   const pvtJson = JSON.stringify(pvt, (key, value) => {
//     return typeof value === "bigint" ? value.toString() : value;
//   });
//   const outputPvt = JSON.parse(pvtJson);

//   const pubJson = JSON.stringify(pub, (key, value) => {
//     return typeof value === "bigint" ? value.toString() : value;
//   });
//   const outputPub = JSON.parse(pubJson);
//   // }
//   res.send({ outputPub, outputPvt });
// });

// app.listen(8000, () => {
//   console.log("listening on 8000");
// });

async function paillierTest(req, res) {
  const { publicKey, privateKey } = await paillier.generateRandomKeys(32)
  console.log("pub",publicKey, "\npvt", privateKey)

  //(A-B)^2
  let a = 40;
  let b = 100;

  // a = a*(-1)
  const a1 = publicKey.encrypt(a);
  const b1 = publicKey.encrypt(b);
  console.log("A1", a1)
  console.log("B1", b1)

  // const b2  =publicKey.multiply(b1,-1)

  // const diff =publicKey.addition(a1, b2);
  // console.log("diff",privateKey.decrypt(diff))

  // const pow = publicKey.encrypt(2);

  // const x_y = publicKey.encrypt(publicKey.multiply(privateKey.decrypt(diff),privateKey.decrypt(pow)));
  // console.log("xy",x_y)
  // console.log("sq",privateKey.decrypt(x_y));

  // const x = 864
  // const x_enc = publicKey.encrypt(x)
  // console.log("test_enc", x_enc)
  // console.log("text_dec", privateKey.decrypt(x_enc))
  console.log("text_dec", privateKey.decrypt(a1))
}
paillierTest();
