# How to deploy the contract

1- create an account on https://dashboard.alchemyapi.io/

2- create new app in alchemy dashboard and select goerli as testnet network.

3- install metamask on chrome and add goerli network.

4- copy `.env.example` and rename it to `.env` and fill it with credentials from your created app in alchemy and metamask account.

5- deply your contract by using below command:

```
npx hardhat run ./scripts/deploy.ts --network goerli
```