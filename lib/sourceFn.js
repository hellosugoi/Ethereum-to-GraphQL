// Pupose of this method is to make the acutall call to EThereum. It will then pass the results to the outputmapper fn.
const sourceFn = ({ contract, method, outputMapper, isCall = true, options }) => {
  return async function () {
    try {
      const instance = await contract.deployed()
      const fn = (isCall)
            ? instance[method].call(...Object.values(arguments))
            : instance[method](...Object.values(arguments), options)
      const data = await fn
      return outputMapper(data)
    } catch (e) {
      console.log('Inside sourceFN error ------------------------ ')
      console.log(e)
      return new Error(e)
    }
  }
}

module.exports = sourceFn
