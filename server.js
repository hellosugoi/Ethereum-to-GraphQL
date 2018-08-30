/*
  THIS IS ONLY HERE for testing purposes!
  You will write something like this yourself for you server.
*/
const express = require('express')
const graphqlHTTP = require('express-graphql')

const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:9545')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(provider)

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
  `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphql
Only for Development purposes!`
))
