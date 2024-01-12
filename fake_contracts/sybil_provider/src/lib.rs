use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedSet;
use near_sdk::{near_bindgen, AccountId};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    iah: UnorderedSet<AccountId>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            iah: UnorderedSet::new(b"i"),
        }
    }
}

// Fake Sybil Provider Contract
#[near_bindgen]
impl Contract {
    // Add accountId to the list of IAH
    pub fn add_human(&mut self, account_id: &AccountId) {
        self.iah.insert(account_id);
    }

    // free - Get places by id
    pub fn is_human(&self, account_id: AccountId) -> bool {
        self.iah.contains(&account_id)
    }
}

#[cfg(test)]
mod tests {
    use near_sdk::AccountId;

    use crate::Contract;

    #[test]
    fn is_human_false() {
        let contract = Contract::default();
        let bob: AccountId = "bob.near".parse().unwrap();

        let result = contract.is_human(bob);
        assert_eq!(result, false)
    }

    #[test]
    fn is_human_true() {
        let mut contract = Contract::default();
        let alice: AccountId = "alice.near".parse().unwrap();

        contract.add_human(&alice);

        let result = contract.is_human(alice);
        assert_eq!(result, true)
    }
}
