const {
	CEP78Client,
	MetadataMutability,
	MintingMode,
	NFTIdentifierMode,
	NFTKind,
	NFTMetadataKind,
	NFTOwnershipMode,
	OwnerReverseLookupMode
} = require("casper-cep78-js-client");

const { csprToMotes, Keys } = require("casper-js-sdk");

const client = new CEP78Client("http://NODE_ADDRESS:7777/rpc", "casper-test");

const keys = Keys.Ed25519.loadKeyPairFromPrivateFile("keys/secret_key.pem");

const deploy = await client.install(
	{
		collectionName: "WhitelistedCollection",
		collectionSymbol: "NFT",
		totalTokenSupply: "100",
		ownershipMode: NFTOwnershipMode.Transferable,
		nftKind: NFTKind.Digital,
		jsonSchema: {},
		nftMetadataKind: NFTMetadataKind.CEP78,
		identifierMode: NFTIdentifierMode.Ordinal,
		metadataMutability: MetadataMutability.Immutable,
		mintingMode: MintingMode.Acl,
		ownerReverseLookupMode: OwnerReverseLookupMode.NoLookup
	},
	csprToMotes(250),
	keys.publicKey,
	[keys]
);

const hash = await deploy.send(client.nodeAddress);
console.log(hash);
