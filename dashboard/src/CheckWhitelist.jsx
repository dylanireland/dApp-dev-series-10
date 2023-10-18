export default function CheckWhitelist(props) {
  return <button onClick={() => checkWhitelist(props)}>Check Whitelist</button>;
}

async function checkWhitelist(props) {
  if (props.publicKey == null) {
    alert("No public key found, please connect to the Casper Wallet");
    return;
  }
  try {
    const response = await fetch(
      "http://localhost:3001/check_whitelist?" +
        new URLSearchParams({
          publicKey: props.publicKey
        })
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const result = await response.text();
    if (result === "true") {
      alert("You ARE on the whitelist");
    } else if (result === "false") {
      alert("You are NOT on the whitelist");
    } else {
      throw new Error("Unknown error occured");
    }
  } catch (error) {
    console.error(error.message);
  }
}
