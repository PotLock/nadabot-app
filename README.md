# nadabot-app

Nada.bot application <https://nada.bot>

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

## Project structure

```markdown
[ / ]
│
├── [ common ] # <- Abstract implementation details, reusable assets, and primitives
│   │          #    used in layouts and business logic across the codebase. AKA "shared" ( see link 1. )
│   │
│   ├── constants.ts
│   ├── assets
│   ├── contexts
│   ├── lib
│   ├── services
│   ├── store
│   └── ui
│
├── [ features ] # <- Business logic units broken down into use case categories.
│   │            #    Simply put, this is a collection of directories that contain code
│   │            #    implementing specific groups of app's functionalities and are named after them.
│   │
│   ├── auth
│   ├── groups
│   └── stamps
│
├── [ hooks ] # <- Contains various React hooks that haven't been yet ( but expected to be in the future )
│             #    relocated and spread across /common and /features according to the purposes they serve.
│
├── [ pages ] # <- Follows Nextjs Pages routing conventions ( see link 2. ),
│             #    with additional Private Folders following Nextjs App routing conventions ( see link 3. ),
│             #    that facilitate layout code-splitting and further migration to App Router ( see link 4. )
│
└── [ public ] # <- Static files handled by web server
```

### Links

1. [Shared layer from Feature-Sliced Design methodology](https://feature-sliced.design/docs/reference/layers#shared)
2. [Nextjs Pages routing conventions](https://nextjs.org/docs/getting-started/project-structure#pages-routing-conventions)
3. [Nextjs App Private Folders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)
4. [Nextjs App Router](https://nextjs.org/docs/app)
