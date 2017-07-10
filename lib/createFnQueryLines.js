const MetaCoinArtifact = require('../build/contracts/Metacoin')

const abiInputToGraphQLType = ({ name, type }) => {
  // console.log(input)
  if (type.includes('int')) {
    return { key: name, value: 'Int' }
  }

  if (type === 'bool') {
    return { key: name, value: 'Boolean' }
  }

  if (type === 'string') {
    return { key: name, value: 'String' }
  }

  if (type.includes('bytes')) {
    return { key: name, value: 'String' }
  }

  if (type === 'address') {
    return { key: name, value: 'String' }
  }

  return new Error(`Unkown abi output type: ${input}`)
}

const genResult = (lines) => {
  let tmp =
`
type Query {
  ${lines}
}`
  return tmp
}


const queryOutput = MetaCoinArtifact.abi
              .filter(item => item.type === 'function')
              .map(item => { return { name: item.name, inputs: item.inputs }})
              .map(item => {
                // console.log(item)
                // return item
                // console.log(JSON.stringify(item.name, null, 2))
                // console.log(getOutputType(item.inputs))
                const allInputs = item.inputs.map(line => {
                  if (line.length === 0) {
                    return ''
                  }
                  return abiInputToGraphQLType(line)
                })
                return { fnName: item.name,
                  types: allInputs
                }
              })
              .reduce((total, item, index) => {
                const { fnName } = item
                const inputs = item.types.reduce((total, cur) => {
                  return `${total} ${cur.key}: ${cur.value}`
                }, '')
                const line = (inputs.length > 0)
                            ? `${fnName} (${inputs} ): ${fnName}Output`
                            : `${fnName}: ${fnName}Output`

                return (index === 0) ? `${total} ${line}`:`${total} \n   ${line}`
              }, '')


module.exports = genResult(queryOutput)
//
// console.log(`${genResult(queryOutput)}`)
// // console.log(JSON.stringify(queryOutput, null, 2))
