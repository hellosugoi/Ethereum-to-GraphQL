# Ethereum ABI to GraphQL Scheme

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

// Configure truffle contract
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

// Use package to create the garphql schema and resolver
const { genGraphQlProperties } = require('ethereum-to-graphql')
const { schema, rootValue } = genGraphQlProperties({ artifact: MetaCoinArtifact, contract: MetCoinContract })

// create server with express
const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}))

const GRAPHQL_PORT = 4000
app.listen(GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql
Only for Development purposes!`
))
```


## Base Types

We have two base types that help us convert some Ethereum int/uint and Bytes into graphQL schema types. The first is for ints/uints. Whenver a function returns these types, you will have the option of returning either the string and/or int type.

```
type Value {
    string: String
    int: Int
}
```

The second base type are the bytes types.

```
type Bytes {
  raw: String
  decoded: String
}
```

When a function returns a bytes, you can chooose to return the raw data or the decoded data if desired.


## Return Type Templates

Because we are auto generating the Schema, we have to define some standard conversions. We have two templates for accessing the return values from solidity:

1. Single: `${typeName}_${IndexOfReturn}`
2. Arrays: `${typeName}Arr_${IndexOfReturn}`

If you return an address as the third return value you would use: `address_2`. If you return a uint in the fourth value you would use `uint256_3`. If you return an array of bytes as the first return you would use `bytes32Arr_0`.


## Writing Queries

To write a query, you must use the function name as the base, pass any variables if any, and then the type name with an index (`${typeName}_${IndexOfOutput}`)

```
// Solidity
function getBalanceInEth(address addr) public returns(uint) {
  return ConvertLib.convert(getBalance(addr), 2);
}

// GraphQL Query
{
  query {
    getBalanceInEth(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
      uint256_0 {
        string
        int
      }
    }
  }
}

// Result
{
  'getBalanceInEth': {
    'uint256_0': {
      'string': '0',
      'int': 0
    }
  }
}
```
Our `getBalanceInEth` function in solidity returns a uint (alias for uint256) as the first and only value. Therefore we  the `uint256_0` key name for that input. As described in our base types above, we can select the string or int types.


We also handle multiple returns and arrays. The additional type change for arrays is the addition of `Arr` to the query type template (`${typeName}Arr_${IndexOfOutput}`). For example, if you return an array of ints as the second return, the schema name is `uint256Arr_1`. A Larger example is below.


```
// Solidity
function returnsOnlyArrays() public view returns(int[], address[], bytes32[]) {
  // ...removed
  return (Arr1, Arr2, Arr3);
}

// GraphQL Query
{
  query {
    returnsOnlyArrays {
      int256Arr_0 {
        string
      }
      addressArr_1
      bytes32Arr_2 {
        decoded
        raw
      }
    }
  }
}

// Result
{
  'returnsOnlyArrays': {
    'int256Arr_0': [
      {
        'string': '2'
      }, {
        'string': '5'
      }, {
        'string': '8'
      }
    ],
    'addressArr_1': [
      '0x0000000000000000000000000000000000000004',
      '0x0000000000000000000000000000000000000007',
      '0x0000000000000000000000000000000000000009'
    ],
    'bytes32Arr_2': [
      {
        'decoded': 'uno',
        'raw': '0x756e6f0000000000000000000000000000000000000000000000000000000000'
      },
      {
        'decoded': 'dos',
        'raw': '0x646f730000000000000000000000000000000000000000000000000000000000'
      },
      {
        'decoded': 'tres',
        'raw': '0x7472657300000000000000000000000000000000000000000000000000000000'
      }
    ]
  }
}
```

For more examples check out the tests for more examples.

# Developing Process (If you want to contribute!)

### Required packages

To help develop, you will need to have [truffle](https://github.com/trufflesuite/truffle) globally installed. You will also need a fake Ethereum node. Either [ganache](https://github.com/trufflesuite/ganache) or [ganache-cli](https://github.com/trufflesuite/ganache-cli) work fine.

## Testing

There are 3 components to testing/developing for this repo: Smart Contracts, Ganache/Ganache-cli, and Jest. To test, you have to first launch Ganache/Ganache-cli, then Deploy your smart contracts via `npm run build-sc`, and lastly you run `npm run test`. You only have to do `npm run build-sc` if you modify the smart contract, or if you restarted you Ganache/Ganache-cli command. If you only modify the javascript code, then you do `npm run test` to run tests.

Special note about ganache/ganache-cli, they start on different ports (8545, 9545) respectively. The test suit has been configured to work with ganache the app. The default account in ganache is staticly set to `0x8B5D608836459Ddb0725C64036569c7630a82FBF`. If you use ganache-cli, you will need to set the correct account in `test/intro.test.js` line 8.

#### Starting fresh or ganache restart/refresh
1. **Start Ganache**
2. `npm run build-sc`
3. `npm run test`

#### Modified the Smart Contracts
**Ganache is running already**
1. `npm run build-sc`
2. `npm run test`

#### Modified only Javascript and already did fresh start
**Ganache is running already**
1. `npm run test`

## GraphiQl for Testing

There is also a gaphiQL server in this repo. You run in by calling `npm run start`. This will allow you to test graqphQL queries locally at `localhost:4000/graphql`
