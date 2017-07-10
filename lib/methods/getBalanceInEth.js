const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const getBalanceInEth = ({ addr }) => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.getBalanceInEth.call(addr)
          })
          .then(data => {
            return {
              string: data.toString(),
              int: data.toNumber()
            }
          })
          .catch(e => {
            return new Error(e)
          })
}
//
// getBalanceInEth()
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.error(e)
//   })

// query {
//   getBalance(addr: "0xfa7528f78db5d38ba6882cf10862f2659d541ece") {
//     string
//     int
//   }
// }
module.exports = getBalanceInEth
