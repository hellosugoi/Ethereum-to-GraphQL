const sourceFn = require('./sourceFn')
const Web3 = require('web3')
const web3 = new Web3()

const genOutputFuncitonMapper = (input) => {
  return (data) => {
    // console.log(data)
    // console.log(Array.isArray(data))
    // console.log(input)
    // console.log(tmp1)

    const resultsIsArr = Array.isArray(data)
    const inputIsArr = Array.isArray(input)

    if (!resultsIsArr || !inputIsArr) { // 1 input for 1 output only
      let tmp1 = input.reduce((out, current, index) => {
        // console.log(current)
        // console.log(index)
        if (current.key === 'value') {
          out[current.name] = {
            string: data.toString(),
            int: data.toNumber()
          }
        } else if (current.key.includes('bytes')) {
          // console.log(data)
          out[current.name] = {
            raw: data,
            decoded: web3.toAscii(data).replace(/\0/g, '')
          }
        } else {
          out[current.name] = data
        }
        return out
      }, {})
      return tmp1
    } else if (resultsIsArr && inputIsArr) {
      if (input.length === data.length) { // multiple input and out
        let tmp1 = input.reduce((out, current, index) => {
          // console.log(current)
          // console.log(index)
          // console.log(data[index])

          if (current.key === 'value') {
            if (Array.isArray(data[index])) { // HACK
              out[current.name] = data[index].map(item => {
                return {
                  string: item.toString(),
                  int: item.toNumber()
                }
              })
            } else {
              out[current.name] = {
                string: data[index].toString(),
                int: data[index].toNumber()
              }
            }
          } else if (current.key.includes('bytes')) {
            // console.log(data)
            if (Array.isArray(data[index])) { // HACK
              out[current.name] = data[index].map(item => {
                return {
                  raw: item,
                  decoded: web3.toAscii(item).replace(/\0/g, '')
                }
              })
            } else {
              out[current.name] = {
                raw: data[index],
                decoded: web3.toAscii(data[index]).replace(/\0/g, '')
              }
            }
          } else { // handles bytes, strings, bools
            out[current.name] = data[index]
          }
          return out
        }, {})
        return tmp1
      } else { // 1 input with multiple outputs
        // console.log('ai m here wih multiple outputs')
        let tmp2 = input.reduce((out, current, index) => {
          // console.log(`current = ${JSON.stringify(current)}`)
          if (current.key === 'value') { // TODO change this key to parseKey
            out[current.name] = data.map(item => {
              return {
                string: item.toString(),
                int: item.toNumber()
              }
            })
          } else if (current.key === 'address') {
            out[current.name] = data
          } else if (current.key.includes('bytes')) {
            // console.log(data)
            out[current.name] = data.map(item => {
              return {
                raw: item,
                decoded: web3.toAscii(item).replace(/\0/g, '')
              }
            })
          }
          return out
        }, {})

        // console.log(tmp2)
        return tmp2
      }
    } else {
      console.log('why am i here? this should never happen')
    }
  }
}

const genOutputFnMapper = ({ queryConverter, contract, artifact }) => {
  const { abi } = artifact

  const outputMappers = queryConverter
                .map(item => {
                  return { fnName: item.name, outputMapper: genOutputFuncitonMapper(item.types) }
                })
                .reduce((out, cur) => {
                  out[cur.fnName] = cur.outputMapper
                  return out
                }, {})
  // console.log(outputMappers)
  // console.log('-----')

  const allFns = abi
                  .filter(item => item.type === 'function')
                  .map(item => { return { contract, fnName: item.name } })

  const allResolvers = allFns
                          .reduce((output, input) => {
                            const { contract, fnName } = input
                            output[input.fnName] = (args) => {
                              // console.log('----args')
                              // console.log(args)
                              // console.log('----args')
                              const outputMapper = outputMappers[input.fnName]
                              return sourceFn({ contract, method: fnName, outputMapper })(...Object.values(args))
                            }
                            return output
                          }, {})

  return {
    outputMappers,
    allResolvers
  }
}

module.exports = {
  genOutputFnMapper
}
