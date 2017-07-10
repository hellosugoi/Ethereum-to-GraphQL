const MetaCoinArtifact = require('../build/contracts/Metacoin')

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
  return`
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
    debugger
    return input.reduce((out, current, index) => {
      debugger
      if (current.key === 'value') {
        if(data instanceof Array) {
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

const cleanData = MetaCoinArtifact.abi
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

module.exports = {
  queryTypes,
  outputMappers
}
// console.log(outputMappers)
