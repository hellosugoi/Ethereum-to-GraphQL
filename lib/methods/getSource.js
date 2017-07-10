const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const getSource = () => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.source.call()
          })
          .then(data => {
            return {
              string: data
            }
          })
          .catch(e => {
            return new Error(e)
          })
}

getSource()
  .then(data => {
    console.log(data)
  })
  .catch(e => {
    console.error(e)
  })

// query {
//   candy {
//     value {
//       string
//       int
//     }
//   }
// }
module.exports = getSource
