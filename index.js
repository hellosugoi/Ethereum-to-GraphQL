const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const Web3 = require('web3')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const sourceFn = require('./lib/sourceFn')

const { queryTypes, outputMappers, allResolvers } = require('./lib/createQLType')
const createFnQueryLines = require('./lib/createFnQueryLines')
const temporary1 = `
${queryTypes}
${createFnQueryLines}
`

// const temporary2 = `
// type Value {
//   string: String
//   int: Int
// }
// type candy {
//   value: Value
// }
// type Query {
//   candy: candy
// }
// `

// console.log(temporary1)
//
// const temporary = `
//   type Value {
//     string: String
//     int: Int
//   }
//
//   type otherOutput {
//     string: String
//     bytes32: String
//     value: Value
//   }
//
//   type returns2Output {
//     value: Value
//     boolean: Boolean
//   }
//
//   type getBalanceOutput {
//     value: Value
//   }
//
//   type Query {
//     getBalance(addr: String): getBalanceOutput
//     getBalanceInEth(addr: String): Value
//     returns2(addr: String num: Int): returns2Output
//     other: otherOutput
//   }
// `

var schema = buildSchema(temporary1)

// const other = require('./lib/methods/other')
// const returns2 = require('./lib/methods/returns2')
// const getBalance = require('./lib/methods/getBalance')
// const getBalanceInEth = require('./lib/methods/getBalanceInEth')
// const getCandy = require('./lib/methods/getCandy')

// The root provides a resolver function for each API endpoint
// const root = {
//   getBalance: (args) => {
//     const outputMapper = outputMappers.getBalance
//     return sourceFn({ contract: MetCoinContract, method: 'getBalance', outputMapper })(...Object.values(args))
//   },
//   getBalanceInEth: (args) => {
//     const outputMapper = outputMappers.getBalanceInEth
//     return sourceFn({ contract: MetCoinContract, method: 'getBalanceInEth', outputMapper })(...Object.values(args))
//   },
//   returns2: (args) => {
//     const outputMapper = outputMappers.returns2
//     return sourceFn({ contract: MetCoinContract, method: 'returns2', outputMapper })(...Object.values(args))
//   },
//   other: () => {
//     const outputMapper = outputMappers.other
//     return sourceFn({ contract: MetCoinContract, method: 'other', outputMapper })()
//   },
//   candy: () => {
//     const outputMapper = outputMappers.candy
//     return sourceFn({ contract: MetCoinContract, method: 'candy', outputMapper })()
//   },
//   source: () => {
//     const outputMapper = outputMappers.source
//     return sourceFn({ contract: MetCoinContract, method: 'source', outputMapper })()
//   }
// }

const root2 = allResolvers

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root2,
  graphiql: true
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
