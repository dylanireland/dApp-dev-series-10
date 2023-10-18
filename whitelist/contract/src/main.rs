#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we're in a
// `no_std` environment.
extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;
use alloc::vec;
use crate::alloc::string::ToString;

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{ApiError, CLType, EntryPointAccess, EntryPointType, EntryPoints, EntryPoint, Parameter, contracts::NamedKeys};

/// An error enum which can be converted to a `u16` so it can be returned as an `ApiError::User`.
#[repr(u16)]
enum Error {
    ContractOwnerCannotApply = 0,
    CannotApproveContractOwner = 1,
    CandidateAlreadyWhitelisted = 2,
    CandidateHasNotApplied = 3,
    CandidateAlreadyCandidate = 4,
}

impl From<Error> for ApiError {
    fn from(error: Error) -> Self {
        ApiError::User(error as u16)
    }
}

#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(
        EntryPoint::new(
            "apply",
            vec![],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        )
    );

    entry_points.add_entry_point(
        EntryPoint::new(
            "approve",
            vec![
                Parameter::new("candidate", CLType::String),
            ],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        )
    );
    let owner = runtime::get_caller().to_formatted_string();

    let mut named_keys = NamedKeys::new();
    named_keys.insert(String::from("owner"), storage::new_uref(owner).into());

    let candidates: Vec<String> = Vec::new();
    let whitelist: Vec<String> = Vec::new();

    let candidates_uref = storage::new_uref(candidates);
	let whitelist_uref = storage::new_uref(whitelist);

	named_keys.insert(String::from("candidates"), candidates_uref.into());
	named_keys.insert(String::from("whitelist"), whitelist_uref.into());

    let (stored_contract_hash, _contract_version) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some("whitelist_contract_package".to_string()),
        Some("whitelist_contract_access_uref".to_string()),
    );
    runtime::put_key("whitelist_contract", stored_contract_hash.into());
}

#[no_mangle]
pub extern "C" fn apply() {
    let contract_owner_uref = runtime::get_key("owner").unwrap_or_revert().into_uref().unwrap_or_revert();
    let contract_owner = storage::read::<String>(contract_owner_uref).unwrap_or_revert().unwrap_or_revert();

    let caller = runtime::get_caller().to_formatted_string();
    
    if caller == contract_owner {
        runtime::revert(Error::ContractOwnerCannotApply);
    }

    let whitelist_uref = runtime::get_key("whitelist").unwrap_or_revert().into_uref().unwrap_or_revert();
    let whitelist = storage::read::<Vec<String>>(whitelist_uref).unwrap_or_revert().unwrap_or_revert();

    let candidates_uref = runtime::get_key("candidates").unwrap_or_revert().into_uref().unwrap_or_revert();
    let mut candidates = storage::read::<Vec<String>>(candidates_uref).unwrap_or_revert().unwrap_or_revert();

    for whitelister in whitelist.iter() {
        if caller == *whitelister {
            runtime::revert(Error::CandidateAlreadyWhitelisted);
        }
    }

    for candidate in candidates.iter() {
        if caller == *candidate {
            runtime::revert(Error::CandidateAlreadyCandidate);
        }
    }

    candidates.push(caller);
    storage::write(candidates_uref, candidates);
}

#[no_mangle]
pub extern "C" fn approve() {
    let caller = runtime::get_caller().to_formatted_string();
    let candidate = runtime::get_named_arg::<String>("candidate");

    let contract_owner_uref = runtime::get_key("owner").unwrap_or_revert().into_uref().unwrap_or_revert();
    let contract_owner = storage::read::<String>(contract_owner_uref).unwrap_or_revert().unwrap_or_revert();

    if caller != contract_owner {
        runtime::revert(Error::CannotApproveContractOwner);
    }

    let whitelist_uref = runtime::get_key("whitelist").unwrap_or_revert().into_uref().unwrap_or_revert();
    let mut whitelist = storage::read::<Vec<String>>(whitelist_uref).unwrap_or_revert().unwrap_or_revert();

    let candidates_uref = runtime::get_key("candidates").unwrap_or_revert().into_uref().unwrap_or_revert();
    let mut candidates = storage::read::<Vec<String>>(candidates_uref).unwrap_or_revert().unwrap_or_revert();

    for whitelister in whitelist.iter() {
        if candidate == *whitelister {
            runtime::revert(Error::CandidateAlreadyWhitelisted);
        }
    }
    let wrapped_index = candidates.iter().position(|i| *i == candidate);
    match wrapped_index {
        Some(index) => {
            candidates.remove(index); // Remove from candidate list
            whitelist.push(candidate);
        },
        None => {
            runtime::revert(Error::CandidateHasNotApplied)
        }
    }
    storage::write(candidates_uref, candidates);
    storage::write(whitelist_uref, whitelist);
}

