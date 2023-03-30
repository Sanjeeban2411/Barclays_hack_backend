const paillier = require("paillier-bigint");
const express = require("express");
require("./db/mongo")
const app = express();

app.get("/generatekeys", async function paillierTest(req, res) {
  const { publicKey, privateKey } = await paillier.generateRandomKeys(64);
  const pub = publicKey;
  const pvt = {
    lambda: privateKey.lambda,
    mu: privateKey.mu,
    _p: privateKey._p,
    _q: privateKey._q,
  };
  
  const pvtJson = JSON.stringify(pvt, (key, value) => {
    return typeof value === "bigint" ? value.toString() : value;
  });
  const outputPvt = JSON.parse(pvtJson);

  const pubJson = JSON.stringify(pub, (key, value) => {
    return typeof value === "bigint" ? value.toString() : value;
  });
  const outputPub = JSON.parse(pubJson);

  res.send({ outputPub, outputPvt });
});

app.listen(8000, () => {
  console.log("listening on 8000");
});

