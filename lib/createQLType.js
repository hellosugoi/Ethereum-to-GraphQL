const sourceFn = require('./sourceFn')

const abiOutputToGraphQLType = (input) => {
  if (input.includes('int')) {
    return { key: 'value', value: 'Value' }
  }

  if (input === 'bool') {
    return { key: 'boolean', value: 'Boolean' }
  }

  if (input === 'string') {
    return { key: 'string', value: 'String' }
  }

  if (input.includes('bytes')) {
    return { key: 'bytes32', value: 'String' }
  }

  return new Error(`Unkown abi output tpe: ${input}`)
}

const getOutputType = (input) => {
  const { type } = input
  return abiOutputToGraphQLType(type)
}

const genType = ({ typeName, typeBody }) => {
  return `
  type ${typeName} {
    ${typeBody}
  }`
}
const typesToSchemaLine = (data) => {
  return data.types
              .map(type => `${type.key}: ${type.value}`)
              .reduce((out, cur, index) => {
                return (index === 0) ? `${out} ${cur}` : `${out} \n     ${cur}`
              }, '')
}

const topString =
`
  type Value {
    string: String
    int: Int
  }`

const genOutputMapper = (input) => {
  return (data) => {
    return input.reduce((out, current, index) => {
      if (current.key === 'value') {
        if (data instanceof Array) {
          out[current.key] = {
            string: data[index].toString(),
            int: data[index].toNumber()
          }
        } else {
          out[current.key] = {
            string: data.toString(),
            int: data.toNumber()
          }
        }
      } else if (typeof data === 'string') {
        out[current.key] = data
      } else {
        out[current.key] = data[index]
      }
      return out
    }, {})
  }
}

const genQueryTypes = ({ artifact, contract }) => {
  const { abi } = artifact
  const cleanData = abi
                .filter(item => typeof item.outputs !== 'undefined')
                .map(item => { return { name: item.name, outputs: item.outputs } })
                .map(item => {
                  item.types = item.outputs.map(data => getOutputType(data))
                  return item
                })

  const outputMappers = cleanData
                .map(item => {
                  return { fnName: item.name, outputMapper: genOutputMapper(item.types) }
                })
                .reduce((out, cur) => {
                  out[cur.fnName] = cur.outputMapper
                  return out
                }, {})

  const queryTypes = cleanData
                .map(item => {
                  const typeName = `${item.name}Output`
                  const typeBody = typesToSchemaLine(item)
                  return genType({ typeName, typeBody })
                })
                .reduce((output, current) => {
                  return output + current
                }, topString)

  const allFns = abi
                  .filter(item => item.type === 'function')
                  .map(item => { return { contract, fnName: item.name } })

  const allResolvers = allFns
                          .reduce((output, input) => {
                            const { contract, fnName } = input
                            output[input.fnName] = (args) => {
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
