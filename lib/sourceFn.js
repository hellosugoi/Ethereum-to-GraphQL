const sourceFn = ({ contract, method, outputMapper, isCall = true, options }) => {
  return async function () {
    const args = arguments
    try {
      const instance = await contract.deployed()
      const fn = (isCall)
            ? instance[method].call(...Object.values(args))
            : instance[method](...Object.values(args), options)
      const data = await fn
      return outputMapper(data)
    } catch (e) {
      console.log('Inside sourceFN error ------------------------ ')
      return new Error(e)
    }
  } // end of input closure
}// end of method closure

module.exports = sourceFn
