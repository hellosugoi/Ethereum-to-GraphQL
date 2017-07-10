const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const other = () => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.other.call()
          })
          .then(data => {
            return {
              string: data[0],
              bytes32: data[1],
              value: {
                string: data[2].toString(),
                int: data[2].toNumber()
              }
            }
          })
          .catch(e => {
            return new Error(e)
          })
}
//
// other()
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.error(e)
//   })

// query {
//   other {
// 		string
//     bytes32
//     value {
//       string
//       int
//     }
//   }
// }
module.exports = other
