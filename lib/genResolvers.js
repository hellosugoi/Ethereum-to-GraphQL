const sourceFn = require('./sourceFn')
const { filterFn } = require('./utils')

// Pupose of this method is to create thhe graphQL resolvers using sourceFN
const genResolvers = ({ outputHandlers, contract, artifact: { abi } }) => {
  return abi
          .filter(filterFn)
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
