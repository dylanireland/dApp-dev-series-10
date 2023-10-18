# Build a CEP-78 NFT Whitelist Application

This is the repository for video #9 of [Casper's dApp Developer Series](https://youtube.com/playlist?list=PL8oWxbJ-csEqjX2A1pprKuHzCBS8RMcmR&si=HhwSYx_fJLvt81ho).

## Run

### Install with:

```bash
git clone https://github.com/dylanireland/dApp-dev-series-9
```

Place a funded private key in *whitelist/keys/secret_key.pem*.

### Compile the contract:

```bash
cd whitelist
make prepare
make build-contract
```

### Deploy the contract:

```bash
chmod +x deploy.sh
./deploy.sh
cd ../
```

Replace `NODE_ADDRESS` with a proper node address in *deploy.sh*, *server.js*, and *src/App.js*.

Start dApp:

```bash
node server.js
npm run start
```
