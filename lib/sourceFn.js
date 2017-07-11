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
      return new Error(e)
    }
  }
}

module.exports = sourceFn
