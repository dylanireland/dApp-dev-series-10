#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we're in a
// `no_std` environment.
extern crate alloc;
use alloc::string::String;
use alloc::vec::Vec;
use casper_types::{URef, ContractHash, RuntimeArgs, runtime_args};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{ApiError, Key};

#[repr(u16)]
enum Error {
    Read = 0,
    ValueNotFound = 1,
}

impl From<Error> for ApiError {
    fn from(error: Error) -> Self {
        ApiError::User(error as u16)
    }
}

#[no_mangle]
pub extern "C" fn call() {
    let whitelist_contract_hash: ContractHash = runtime::get_named_arg::<Key>("whitelist_contract_hash")
    .into_hash()
    .map(|hash| ContractHash::new(hash))
    .unwrap();
    let nft_contract_hash: ContractHash = runtime::get_named_arg::<Key>("nft_contract_hash")
    .into_hash()
    .map(|hash| ContractHash::new(hash))
    .unwrap();

    let whitelist_uref: URef = runtime::call_contract(
        whitelist_contract_hash,
        "get_whitelist_uref",
        RuntimeArgs::default(),
    );

    let whitelist: Vec<String> = storage::read(whitelist_uref)
        .unwrap_or_revert_with(Error::Read)
        .unwrap_or_revert_with(Error::ValueNotFound);

    let acl_whitelist: Vec<Key> = whitelist.into_iter()
        .map(|address| Key::from_formatted_str(&address).unwrap())
        .collect();

    runtime::call_contract::<()>(
        nft_contract_hash,
        "set_variables",
        runtime_args! {
            "acl_whitelist" => acl_whitelist,
        },
    );
}
