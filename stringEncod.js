const paillier = require("paillier-bigint");
const bigInt = require("big-integer");


async function paillierTest(req, res) {
  const { publicKey, privateKey } = await paillier.generateRandomKeys(32);

  const encoder = new TextEncoder();
  const str = "Hello, world!";



}
paillierTest();
