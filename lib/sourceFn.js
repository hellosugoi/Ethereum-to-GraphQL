const sourceFn = ({ contract, method, outputMapper, isCall = true, options }) => {
  return function () {
    // console.log('============ start ============')
    return new Promise((resolve, reject) => {
      return contract
              .deployed()
              .then(instance => {
                // console.log('Inside sourceFN ------------------------ 1')
                return (isCall)
                      ? instance[method].call(...Object.values(arguments))
                      : instance[method](...Object.values(arguments), options)
              })
              .then(data => {
                // console.log('Inside sourceFN ------------------------ 2')
                return resolve(outputMapper(data))
              })
              .catch(e => {
                console.log('Inside sourceFN error ------------------------ ')
                return reject(e)
              })
    })
  } // end of input closure
}// end of method closure

module.exports = sourceFn
