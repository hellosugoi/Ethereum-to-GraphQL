const Web3 = require('web3')
const contract = require('truffle-contract')
const MetaCoinArtifact = require('../../build/contracts/Metacoin')
const MetCoinContract = contract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const returns2 = ({ addr }) => {
  return MetCoinContract
          .deployed()
          .then(instance => {
            return instance.returns2.call(addr)
          })
          .then(data => {
            return {
              value: {
                string: data[0].toString(),
                int: data[0].toNumber()
              },
              boolean: data[1]
            }
          })
          .catch(e => {
            return new Error(e)
          })
}
//
// returns2({ addr: '0xfa7528f78db5d38ba6882cf10862f2659d541ece' })
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.error(e)
//   })


// query {
//   returns2(addr: "0xfa7528f78db5d38ba6882cf10862f2659d541ece") {
// 		boolean
//     value {
//       string
//       int
//     }
//   }
// }
module.exports = returns2
