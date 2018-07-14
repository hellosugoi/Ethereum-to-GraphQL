const sourceFn = require('./sourceFn')

const genResolvers = ({ outputHandlers, contract, artifact: { abi } }) => {
  return abi
          .filter(item => item.type === 'function')
          .reduce((output, { name }) => {
            output[name] = (args) => {
              return sourceFn({
                contract,
                method: name,
                outputMapper: outputHandlers[name]
              })(...Object.values(args))
            }
            return output
          }, {})
}

module.exports = {
  genResolvers
}
