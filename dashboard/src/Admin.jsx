import {
	CLPublicKey,
	CLValueBuilder,
	RuntimeArgs,
	DeployUtil,
	CLByteArray,
	decodeBase16
} from "casper-js-sdk";
import React from "react";

export default function Admin(props) {
	const [contractOwner, setContractOwner] = React.useState(null);
	const [mode, setMode] = React.useState(null);
	const [candidates, setCandidates] = React.useState(null);
	const [whitelist, setWhitelist] = React.useState(null);

	if (contractOwner == null) {
		getContractOwner(setContractOwner);
		return <h1>Verifying Contract Ownership...</h1>;
	} else if (
		contractOwner != CLPublicKey.fromHex(props.publicKey).toAccountHashStr()
	) {
		return (
			<>
				<h1>You are not the contract owner</h1>
				<button onClick={() => props.setAdmin(null)}>Go Back</button>
			</>
		);
	} else if (mode == null) {
		return (
			<>
				<button onClick={() => setMode("candidates")}>Candidates</button>
				<button onClick={() => setMode("whitelist")}>Whitelist</button>
			</>
		);
	} else if (mode == "candidates") {
		if (candidates == null) {
			getList(mode, setCandidates);
			return <h1>Loading Candidates...</h1>;
		} else {
			return buildJSX(candidates, mode, approve, props);
		}
	} else if (mode == "whitelist") {
		if (whitelist == null) {
			getList(mode, setWhitelist);
			return <h1>Loading Whitelist...</h1>;
		} else {
			return (
				<>
					{buildJSX(whitelist, mode)}
					<button onClick={() => applyWhitelist(props)}>Apply Whitelist</button>
				</>
			);
		}
	}
}

async function getContractOwner(setContractOwner) {
	try {
		const response = await fetch("http://localhost:3001/contract_owner");
		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(errorMessage);
		}
		const result = await response.text();
		setContractOwner(result);
	} catch (error) {
		console.error(error.message);
	}
}

async function getList(list, setList) {
	try {
		const response = await fetch(
			"http://localhost:3001/get_list?" +
				new URLSearchParams({
					list: list
				}),
			{
				ContentType: "application/json"
			}
		);
		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(errorMessage);
		}
		const data = await response.json();
		setList(data);
	} catch (error) {
		console.error(error.message);
	}
}

async function applyWhitelist(props) {
	const cep78ContractHash =
		"hash-ff6ab59fc9bdc1015ece5ba99acee8db0e442c58e829012f2ed5a638ce08d02d";
	const cep78ContractHashBytes = new CLByteArray(
		decodeBase16(cep78ContractHash.slice(5))
	);
	const whitelistContractHashBytes = new CLByteArray(
		decodeBase16(props.contractClient.contractHash.slice(5))
	);

	const args = RuntimeArgs.fromMap({
		nft_contract_hash: CLValueBuilder.key(cep78ContractHashBytes),
		whitelist_contract_hash: CLValueBuilder.key(whitelistContractHashBytes)
	});

	let wasm;
	try {
		wasm = await getWasm();
	} catch (error) {
		console.error(error);
		return;
	}

	const deploy = props.contractClient.install(
		wasm,
		args,
		"10000000000",
		CLPublicKey.fromHex(props.publicKey),
		"casper-test"
	);

	const deployJson = DeployUtil.deployToJson(deploy);

	try {
		const result = await props.provider.sign(
			JSON.stringify(deployJson),
			props.publicKey
		);
		if (result.cancelled) {
			alert("Signature cancelled.");
			return;
		}
		const signedDeploy = DeployUtil.setSignature(
			deploy,
			result.signature,
			CLPublicKey.fromHex(props.publicKey)
		);
		const signedDeployJson = DeployUtil.deployToJson(signedDeploy);
		const response = await fetch("http://localhost:3001/deploy", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(signedDeployJson)
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(errorMessage);
		}
		console.log(await response.text());
	} catch (error) {
		console.error(error.message);
	}
}

async function approve(props, candidate) {
	const args = RuntimeArgs.fromMap({
		candidate: CLValueBuilder.string(candidate)
	});

	const deploy = props.contractClient.callEntrypoint(
		"approve",
		args,
		CLPublicKey.fromHex(props.publicKey),
		"casper-test",
		"4000000000" // 4 CSPR
	);

	const deployJson = DeployUtil.deployToJson(deploy);
	try {
		const result = await props.provider.sign(
			JSON.stringify(deployJson),
			props.publicKey
		);

		if (result.cancelled) {
			alert("Signature request cancelled.");
			return;
		}

		const signedDeploy = DeployUtil.setSignature(
			deploy,
			result.signature,
			CLPublicKey.fromHex(props.publicKey)
		);

		const signedDeployJson = DeployUtil.deployToJson(signedDeploy);

		const response = await fetch("http://localhost:3001/deploy", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(signedDeployJson)
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(errorMessage);
		}

		alert(await response.text());
	} catch (error) {
		alert(error.message);
	}
}

function buildJSX(accounts, mode, approve, props) {
	if (accounts.length == 0) {
		return <h1>{mode} is empty</h1>;
	}
	return (
		<ul>
			{accounts.map((account, index) => (
				<div key={account}>
					<li>{account}</li>
					{mode === "candidates" && (
						<button onClick={() => approve(props, account)}>Approve</button>
					)}
				</div>
			))}
		</ul>
	);
}

async function getWasm() {
	const result = await fetch("http://localhost:3001/getWASM");
	if (!result.ok) {
		throw new Error(await result.text());
	}
	const buffer = await result.arrayBuffer();
	return new Uint8Array(buffer);
}
