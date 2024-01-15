casper-client put-deploy \
--node-address http://5.9.6.115:7777/rpc \
--chain-name casper-test \
--secret-key ../keys/secret_key.pem \
--payment-amount 40000000000 \
--session-path ./contract/target/wasm32-unknown-unknown/release/contract.wasm
