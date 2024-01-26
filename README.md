# nadabot-app

Nada.bot application https://nada.bot

## Getting Started

First, run the development server:

```bash
nvm use; npm install;
# then
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Env vars

```sh
# NETWORK (testnet or mainnet)
NEXT_PUBLIC_NETWORK=testnet

# The smart contract ID (ID of the account where the contract was deployed)
NEXT_PUBLIC_CONTRACT_NAME=<smart contract - account id>

# SOCIAL DB Smart Contract: v1.social08.testnet OR social.near
# Get to know more here: https://github.com/NearSocial/social-db
NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID=v1.social08.testnet

# Pinata JWT
PINATA_JWT=<jwt-code>
```
