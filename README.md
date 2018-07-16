Ethereum ABI to GraphQL Scheme
-------

This will consume an ABI object created when deploying a Solidity/Viper/Serpent Smart contract, and return a graphql schema and resolver. This object can be plugged into a the graphql server of your choice.


# Setup:

Install the package with npm or yarn.
1. `npm install ethereum-to-graphql`
2. `yarn add ethereum-to-graphql`

Your server will have to read an abi file and pass it through this package. We return an object that you pass into your graqhQL server.

```javascript
const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql')

const app = express();
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const url = 'http://localhost:8545'

const { genGraphQlProperties } = require('ethereum-to-graphql')
const { schema, rootValue } = genGraphQlProperties({ artifacts: [MetaCoinArtifact], provider: { url }, graphql })


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true
}));

app.listen(4000);
```

# Testing

To run tests, you will need to have [truffle](https://github.com/trufflesuite/truffle) and [testrpc](https://github.com/ethereumjs/testrpc) installed globally.

1. Terminal Window 1: `cd <this project>`
2. Terminal Window 1: `testrpc`
3. Terminal Window 2: `cd <this project>`
4. Terminal Window 2: `truffle migrate`
5. Terminal Window 2: `npm test`