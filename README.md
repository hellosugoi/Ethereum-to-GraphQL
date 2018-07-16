Ethereum ABI to GraphQL Scheme
-------

This will consume an ABI object created when deploying a Solidity/Viper/Serpent Smart contract, and return a graphql schema and resolver. This object can be plugged into a the graphql server of your choice.


# Usage:

Install the package with npm or yarn.
1. `npm install ethereum-to-graphql`
2. `yarn add ethereum-to-graphql`

Your server will have to read an abi file and pass it through this package. We return an object that you pass into your graqhQL server.

```javascript
const express = require('express')
const graphqlHTTP = require('express-graphql')

const Web3 = require('web3')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const { genGraphQlProperties } = require('./lib/index') // require('ethereum-to-graphql)
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

# Testing

To run tests, you will need to have [truffle](https://github.com/trufflesuite/truffle) and [testrpc](https://github.com/ethereumjs/testrpc) installed globally.

1. Terminal Window 1: `cd <this project>`
2. Terminal Window 1: `testrpc`
3. Terminal Window 2: `cd <this project>`
4. Terminal Window 2: `truffle migrate`
5. Terminal Window 2: `npm test`