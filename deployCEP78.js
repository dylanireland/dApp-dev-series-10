import {
	CEP78Client,
	MetadataMutability,
	MintingMode,
	NFTIdentifierMode,
	NFTKind,
	NFTMetadataKind,
	NFTOwnershipMode,
	OwnerReverseLookupMode
} from "casper-cep78-js-client";
import { csprToMotes, Keys } from "casper-js-sdk";

const client = new CEP78Client("http://5.9.6.115:7777/rpc");

const keys = Keys.loadKeyPairFromPrivateFile("keys/secret_key.pem");

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
	keys
);
