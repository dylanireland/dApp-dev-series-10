import "./App.css";
import React from "react";
import Wallet from "./Wallet";
import Apply from "./Apply";
import Admin from "./Admin";
import CheckWhitelist from "./CheckWhitelist";
import { CasperClient, Contracts } from "casper-js-sdk";

function App() {
	const [publicKey, setPublicKey] = React.useState(null);
	const [mode, setMode] = React.useState(null);

	const CasperWalletProvider = window.CasperWalletProvider;
	const CasperWalletEventTypes = window.CasperWalletEventTypes;

	if (CasperWalletProvider == null || CasperWalletEventTypes == null) {
		return <h1>Casper Wallet is not installed</h1>;
	}

	const provider = CasperWalletProvider();

	const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc");
	const contractClient = new Contracts.Contract(casperClient);

	const contractHash =
		"hash-99e420fd72af43b174fbbc265e62e17d05f475a57b83c2f55e12b794e6f7582e";

	contractClient.setContractHash(contractHash);

	let component = <></>;

	if (publicKey == null) {
		component = (
			<Wallet
				publicKey={publicKey}
				setPublicKey={setPublicKey}
				provider={provider}
			/>
		);
	} else if (mode == null) {
		component = (
			<>
				<button onClick={() => setMode("admin")}>Admin</button>
				<button onClick={() => setMode("user")}>User</button>
			</>
		);
	} else if (mode == "admin") {
		component = (
			<Admin
				publicKey={publicKey}
				casperClient={casperClient}
				contractClient={contractClient}
				provider={provider}
				setAdmin={setMode}
			/>
		);
	} else if (mode == "user") {
		component = (
			<>
				<Apply
					publicKey={publicKey}
					casperClient={casperClient}
					contractClient={contractClient}
					provider={provider}
				/>
				<CheckWhitelist publicKey={publicKey} />
			</>
		);
	}

	let navBar = <></>;
	if (publicKey != null) {
		navBar = (
			<div id="nav">
				<button
					onClick={() => handleBackButtonPressed(mode, setMode, setPublicKey)}
				>
					back
				</button>
				<p>{publicKey}</p>
			</div>
		);
	}
	return (
		<div>
			{navBar}
			<div>{component}</div>
		</div>
	);
}

function handleBackButtonPressed(mode, setMode, setPublicKey) {
	if (mode == null) {
		setPublicKey(null);
	} else if (mode == "admin" || mode == "user") {
		setMode(null);
	}
}

export default App;
