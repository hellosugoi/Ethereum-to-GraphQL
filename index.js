const express = require('express')
const graphqlHTTP = require('express-graphql')

const Web3 = require('web3')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const { genGraphQlProperties } = require('./lib/index')
const { schema, rootValue } = genGraphQlProperties({ artifact: MetaCoinArtifact, contract: MetCoinContract })
// console.log('--------- GraphQL Schema ----------')
// console.log(rootValue)
// console.log(schema)

// const app = express()
// app.use('/graphql', graphqlHTTP({
//   schema,
//   rootValue,
//   graphiql: true
// }))
// app.listen(4000)
// console.log('Running a GraphQL API server at localhost:4000/graphql')
