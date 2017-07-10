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

const queryTypes = MetaCoinArtifact.abi
              .filter(item => typeof item.outputs !== 'undefined')
              .map(item => { return { name: item.name, outputs: item.outputs } })
              .map(item => {
                item.types = item.outputs.map(data => getOutputType(data))
                return item
              })
              .map(item => {
                const typeName = `${item.name}Output`
                const typeBody = typesToSchemaLine(item)
                return genType({ typeName, typeBody })
              })
              .reduce((output, current) => {
                return output + current
              }, topString)

console.log(`${queryTypes}`)
