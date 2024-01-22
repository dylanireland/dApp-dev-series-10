const express = require("express");
const app = express();
const cors = require("cors");
const {
	CasperClient,
	Contracts,
	CLPublicKey,
	DeployUtil
} = require("casper-js-sdk");
const fs = require("fs");

app.use(express.json({ limit: "50mb" }));
app.use(cors());

const client = new CasperClient("http://NODE_ADDRESS:7777/rpc");
const contract = new Contracts.Contract(client);

contract.setContractHash(
	"hash-99e420fd72af43b174fbbc265e62e17d05f475a57b83c2f55e12b794e6f7582e"
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

app.get("/getWASM", (req, res) => {
	const wasm = new Uint8Array(
		fs.readFileSync(
			`../update_whitelist/contract/target/wasm32-unknown-unknown/release/contract.wasm`
		)
	);
	res.send(Buffer.from(wasm));
});

app.listen(3001, () => {
	console.log(`App listening on port 3001`);
});
