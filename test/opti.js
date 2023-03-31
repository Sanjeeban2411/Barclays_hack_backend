const paillier = require("paillier-bigint");
const express = require("express");
const app = express();


app.get("/generatekeys", async function paillierTest(req, res) {
    // async function paillierTest(req, res) {
    const { publicKey, privateKey } = await paillier.generateRandomKeys(64);
   
    const privateKeyJson = {
        lambda: privateKey.lambda.toString(),
        mu: privateKey.mu.toString(),
        _p: privateKey._p.toString(),
        _q: privateKey._q.toString()
      };
      
      // Export the public key as a JSON string
      const publicKeyJson = {
        n: publicKey.n.toString(),
        _n2:publicKey._n2.toString() ,
        g: publicKey.g.toString()
      };

    // console.log(pub , pvt);
 
    // const pvtJson = JSON.stringify(pvt)
    //   console.log(pvtJson);

    //   const outputPvt = JSON.parse(pvtJson);
    //   const outputPvt_encoded = btoa(outputPvt)
    //   console.log(outputPvt_encoded)


    
    //   const pubJson = JSON.stringify(pub) ;

    //   const outputPub = JSON.parse(pubJson);
    //   outputPub_encoded =  btoa(outputPub)
    //   // }
    
    


      res.send({ privateKeyJson, publicKeyJson });
    });
    
    app.listen(5000, () => {
      console.log("listening on 5000");
    });




