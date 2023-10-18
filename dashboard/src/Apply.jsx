import { RuntimeArgs, CLPublicKey, DeployUtil } from "casper-js-sdk";

export default function Apply(props) {
  return <button onClick={() => apply(props)}>Apply</button>;
}

async function apply(props) {
  if (props.publicKey == null) {
    alert("No public key found, please connect to the Casper Wallet");
    return;
  }

  const args = RuntimeArgs.fromMap({});

  const deploy = props.contractClient.callEntrypoint(
    "apply",
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
