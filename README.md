# nadabot-app

Nada.bot application https://nada.bot

## Getting Started

```bash
nvm use; npm install;
# then run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Env vars

Create an env file named `.env.local` at the root of the project with the following content:

```sh
# NETWORK (testnet or mainnet)
NEXT_PUBLIC_NETWORK=testnet

# The smart contract ID (ID of the account where the contract was deployed)
# testnet: v1.nadabot.testnet
# staging: v2new.staging.nadabot.near
# mainnet: v1.nadabot.near
NEXT_PUBLIC_CONTRACT_NAME=<smart_contract_address>

# SOCIAL DB Smart Contract: v1.social08.testnet OR social.near
# Get to know more here: https://github.com/NearSocial/social-db
NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID=v1.social08.testnet

# Pinata JWT (ask Shot for the JWT Key)
PINATA_JWT=<jwt-code>
```
