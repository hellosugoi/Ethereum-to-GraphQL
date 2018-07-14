const sourceFn = require('./sourceFn')
const BigNumber = require('web3').BigNumber

let graphQLTypeMapper = {
  'uint256[]': 'uint256Arr'
}

const convertTypeToGraphQLName = ({type, name}, index) => {
  if (name !== '') {
    return name
  }
  let queryName = type
  if (type.includes('[]')) {
    queryName = `${type.substring(0, type.length - 2)}Arr_${index}`
  } else {
    queryName = `${type}_${index}`
  }
  // console.log(queryName)
  return queryName
}

const abiOutputToGraphQLType = (input, index) => {
  const { type } = input
  // console.log(`output.name = ${input.name}, output.type = ${input.type}`)
  // const name = `${input.type}_${index}`
  const name = convertTypeToGraphQLName(input, index)
  // console.log(`name = ${name}`)
  if (type.includes('int')) {
    // let value = (input.includes('[]')) ? 'Value[]' : 'Value'
    // return { key: 'value', value: value }
    // let nameTest = graphQLTypeMapper[input.type]

    if (type.includes('[]')) {
      // console.log('================')
      // console.log(input)
      // console.log('================')
      return { key: 'value', value: '[Value]', name, index }
    }

    return { key: 'value', value: 'Value', name, index }
  }

  if (type === 'bool') {
    // console.log(input)
    let boolean = (type.includes('[]')) ? 'Boolean[]' : 'Boolean'
    return { key: 'boolean', value: boolean, name, index }
  }

  if (type === 'string') {
    return { key: 'string', value: 'String', name, index }
  }

  if (type.includes('bytes')) {
    return { key: 'bytes32', value: 'String', name, index }
  }

  if (type.includes('address')) {
    if (type.includes('[]')) {
      return { key: 'address', value: '[String]', name, index }
    }
    return { key: 'address', value: 'String', name, index }
  }

  return new Error(`Unkown abi output type: ${type}`)
}

// const getOutputType = (input, index) => {
//   // const { type } = input

//   // console.log('======= 1 ')
//   // console.log(JSON.stringify(input, null, 2))
//   // console.log(index)
//   // console.log('======= 2')
//   // input.name = `${input.type}_index`
//   return abiOutputToGraphQLType(input, index)
// }

const genType = ({ typeName, typeBody }) => {
  return `
  type ${typeName} {
    ${typeBody}
  }`
}
const typesToSchemaLine = (data) => {
  let tmp = data.types
              .map(type => `${type.name}: ${type.value}`)
              .reduce((out, cur, index) => {
                return (index === 0) ? `${out} ${cur}` : `${out} \n     ${cur}`
              }, '')

  // if (data.name === 'returnsArrayInt') {
  //   console.log(JSON.stringify(data, null, 2))
  //   console.log(tmp)
  // }
  return tmp
}

const topString =
`
  type Value {
    string: String
    int: Int
  }`

const genOutputFuncitonMapper = (input) => {
  return (data) => {
    // console.log(data)
    // console.log(Array.isArray(data))
    // console.log(input)
    // console.log(tmp1)

    const resultsIsArr = Array.isArray(data)
    const inputIsArr = Array.isArray(input)

    if (!resultsIsArr || !inputIsArr) {
      // this means this is a 1 input 1 output scenario
      let tmp1 = input.reduce((out, current, index) => {
        // console.log(current)
        // console.log(index)
        if (current.key === 'value') {
          out[current.name] = {
            string: data.toString(),
            int: data.toNumber()
          }
        } else {
          out[current.name] = data
        }
        return out
      }, {})
      return tmp1
    } else if (resultsIsArr && inputIsArr) {
      if (input.length === data.length) { // 1 input per output
        // console.log('inptus match outputs')
        let tmp1 = input.reduce((out, current, index) => {
          // console.log(current)
          // console.log(index)
          if (current.key === 'value') {
            out[current.name] = {
              string: data[index].toString(),
              int: data[index].toNumber()
            }
          } else { // handles bytes, strings, bools
            out[current.name] = data[index]
          }
          return out
        }, {})
        return tmp1
      } else { // 1 input with multiple outputs
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
          }
          return out
        }, {})

        // console.log(tmp2)
        return tmp2
      }
    }
  }
}

const genQueryTypes = ({ artifact, contract }) => {
  const { abi } = artifact
  const cleanData = abi
                .filter(item => typeof item.outputs !== 'undefined')
                .map(item => { return { name: item.name, outputs: item.outputs } })
                .map(item => {
                  // console.log(item)
                  item.types = item.outputs.map(abiOutputToGraphQLType)
                  return item
                })
  // console.log(JSON.stringify(cleanData, null, 2))
  // console.log('----- last')
  const outputMappers = cleanData
                .map(item => {
                  return { fnName: item.name, outputMapper: genOutputFuncitonMapper(item.types) }
                })
                .reduce((out, cur) => {
                  out[cur.fnName] = cur.outputMapper
                  return out
                }, {})
  // console.log(outputMappers)
  // console.log('-----')
  const queryTypes = cleanData
                .map(item => {
                  const typeName = `${item.name}` // function name = type name
                  // console.log(`typeName = ${}`)
                  const typeBody = typesToSchemaLine(item)
                  return genType({ typeName, typeBody })
                })
                .reduce((output, current) => {
                  return output + current
                }, topString)

  // console.log(queryTypes)
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
    queryTypes,
    outputMappers,
    allResolvers
  }
}

module.exports = {
  genQueryTypes
}
// console.log(outputMappers)
