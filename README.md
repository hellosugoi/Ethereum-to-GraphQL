Ethereum ABI to GraphQL Scheme
-------

This will consume an ABI object created when deploying a Solidity/Viper/Serpent Smart contract, and return a graphql schema and resolver. This object can be plugged into a the graphql server of your choice.


# Usage:

Install the package with npm or yarn.
1. `npm install ethereum-to-graphql`
2. `yarn add ethereum-to-graphql`

Once installed, you have to create your own graphql server. This means you pass in the original Artifact created by truffle, and the constructed contract from `truffle-contract`.
This package will retrun the schema and rootValue that you can pass into your GraphQL server. An example is shown below.

```javascript
const express = require('express')
const graphqlHTTP = require('express-graphql')

const Web3 = require('web3')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const { genGraphQlProperties } = require('ethereum-to-graphql')
const { schema, rootValue } = genGraphQlProperties({ artifact: MetaCoinArtifact, contract: MetCoinContract })

const GRAPHQL_PORT = 4000

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}))
app.listen(GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql
Only for Development purposes!`
))
```

# Developing Process (If you want to contribute!)

### Required packages

To help develop, you will need to have [truffle](https://github.com/trufflesuite/truffle) globally installed. You will also need a fake Ethereum node. Either [ganache](https://github.com/trufflesuite/ganache) or [ganache-cli](https://github.com/trufflesuite/ganache-cli) work fine.

## Testing

There are 3 components to testing/developing for this repo: Smart Contracts, Ganache/Ganache-cli, and Jest. You have to first launch Ganache/Ganache-cli, then Deploy your smart contracts via `npm run build-sc`, and lastly you run `npm run test`. You only have to do `npm run build-sc` if you modify the smart contract, or if you restarted you Ganache/Ganache-cli command. If you only modify the javascript code, then you do `npm run test` to run tests.

#### Starting fresh or ganache restart/refresh
1. **Start ganache**
2. `npm run build-sc`
3. `npm run test`

#### Modified the Smart Contracts
1. `npm run build-sc`
2. `npm run test`

#### Modified only Javascript and already did fresh start
1. `npm run test`

## GraphiQl for Testing

There is also a gaphiQL server in this repo. You run in by calling `npm run start`. This will allow you to test graqphQL queries locally.
