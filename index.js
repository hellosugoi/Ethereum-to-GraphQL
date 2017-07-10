const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const Web3 = require('web3')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('./build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

// let has2 = function(a, b) {
//   console.log(a)
//   console.log(b)
// }
// let lol = {a: 'a', b:'b'}
// let tmp = function(args) {
//   // console.log(arguments)
//   return has2(...arguments)
// }
// tmp(...Object.values(lol))


const sourceFn = ({ contract, method, outputMapper, isCall = true, options }) => {
  return function () {
    console.log('============ start ============')
    return new Promise((resolve, reject) => {
      return contract
              .deployed()
              .then(instance => {
                console.log('Inside sourceFN ------------------------ 1')
                return (isCall)
                      ? instance[method].call(...Object.values(arguments))
                      : instance[method](...Object.values(arguments), options)
              })
              .then(data => {
                console.log('Inside sourceFN ------------------------ 2')
                return resolve(outputMapper(data))
              })
              .catch(e => {
                console.log('Inside sourceFN error ------------------------ ')
                return reject(e)
              })
    })
  } // end of input closure
}// end of method closure

const { queryTypes, outputMappers } = require('./lib/createQLType')
const createFnQueryLines = require('./lib/createFnQueryLines')
const temporary1 = `
${queryTypes}
${createFnQueryLines}
`

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

var schema = buildSchema(temporary1);

// const other = require('./lib/methods/other')
// const returns2 = require('./lib/methods/returns2')
// const getBalance = require('./lib/methods/getBalance')
// const getBalanceInEth = require('./lib/methods/getBalanceInEth')

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  getBalance: (args) => {
    const outputMapper = outputMappers.getBalance
    return sourceFn({ contract: MetCoinContract, method: 'getBalance', outputMapper })(...Object.values(args))
  },
  getBalanceInEth: (args) => {
    const outputMapper = outputMappers.getBalanceInEth
    return sourceFn({ contract: MetCoinContract, method: 'getBalanceInEth', outputMapper })(...Object.values(args))
  },
  returns2: (args) => {
    const outputMapper = outputMappers.returns2
    return sourceFn({ contract: MetCoinContract, method: 'returns2', outputMapper })(...Object.values(args))
  },
  other: () => {
    const outputMapper = outputMappers.other
    return sourceFn({ contract: MetCoinContract, method: 'other', outputMapper })()
  }
};

// const root = createdResolvers

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
