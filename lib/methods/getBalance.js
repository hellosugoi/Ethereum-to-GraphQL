const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const getBalance = ({ addr }) => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.getBalance.call(addr)
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
// getBalance()
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.error(e)
//   })

// query {
//   getBalance(addr: "0x59bd995b490359f1702b4e12717fe9c8093b7e5c") {
//     string
//     int
//   }
// }
// query {
//   getBalance(addr: "0x59bd995b490359f1702b4e12717fe9c8093b7e5c") {
//     value {
//       string
//       int
//     }
//   }
// }

module.exports = getBalance
