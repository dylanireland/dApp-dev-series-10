const express = require("express");
const app = express();
const cors = require("cors");
const {
  CasperClient,
  Contracts,
  CLPublicKey,
  DeployUtil
} = require("casper-js-sdk");

app.use(express.json());
app.use(cors());

const client = new CasperClient("http://NODE_ADDRESS:7777/rpc");
const contract = new Contracts.Contract(client);

contract.setContractHash(
  "hash-b33d7b21bc928d8460a617867ce041ae5e6afb7855d952e2b4716547d9bca8f3"
);

app.post("/deploy", async (req, res) => {
  try {
    const deploy = DeployUtil.deployFromJson(req.body).unwrap();
    const deployHash = await client.putDeploy(deploy);
    res.send(deployHash);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/get_list", async (req, res) => {
  if (req.query?.list != "candidates" && req.query?.list != "whitelist") {
    res.status(400).send("Improper list flag.");
  }

  try {
    const data = await contract.queryContractData([req.query.list]);
    let list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(data[i].data);
    }
    res.send(JSON.stringify(list));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/check_whitelist", async (req, res) => {
  if (!req.query.publicKey) {
    res.status(400).send("No public key provided");
  }

  const accountHash = CLPublicKey.fromHex(
    req.query.publicKey
  ).toAccountHashStr();
  try {
    const whitelist = await contract.queryContractData(["whitelist"]);
    let found = false;
    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i].data == accountHash) {
        found = true;
        break;
      }
    }
    res.send(found);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/contract_owner", async (req, res) => {
  try {
    const owner = await contract.queryContractData(["owner"]);
    res.send(owner);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

app.listen(3001, () => {
  console.log(`App listening on port 3001`);
});
