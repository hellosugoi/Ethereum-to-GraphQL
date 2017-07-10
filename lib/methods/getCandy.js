const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const getCandy = () => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.candy.call()
          })
          .then(data => {
            return {
              value: {
                string: data.toString(),
                int: data.toNumber()
              }
            }
          })
          .catch(e => {
            return new Error(e)
          })
}
//
// getCandy()
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.error(e)
//   })
//
// query {
//   candy {
//     value {
//       string
//       int
//     }
//   }
// }
module.exports = getCandy
