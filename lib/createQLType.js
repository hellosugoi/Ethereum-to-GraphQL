const MetaCoinArtifact = require('../build/contracts/Metacoin')

const abiOutputToGraphQLType = (input) => {
  const isInt = input.includes('int')
  if (isInt) {
    return 'Balance'
  }

  if (input === 'bool') {
    return 'Bool'
  }

  if (input === 'string') {
    return 'String'
  }

  if (input === 'bytes32') {
    return 'String'
  }

  return new Error(`Unkown abi output tpe: ${input}`)
}

const getOutputType = (input) => {
  const { type } = input
  return abiOutputToGraphQLType(type)
}

const genType = (data) => {
  console.log(data)
  const tmp = `
  type Query {

  }`
  console.log('============')
  console.log(tmp)
  console.log('============')
}

const queryTypes = MetaCoinArtifact.abi
              // .filter(item => item.name === 'getBalance')
              .filter(item => typeof item.outputs !== 'undefined')
              .filter(item => item.name !== 'sendCoin')
              .map(item => { return { name: item.name, outputs: item.outputs } })
              .map(item => {
                console.log(item.outputs)
                const outGraphQLType = item.outputs.map(data => {
                  const typeName = (data.name === '') ? `abi_${data.type}` : data.name
                  return { type: getOutputType(data), name: typeName }
                })
                const inner = {
                  name: item.name,
                  types: outGraphQLType
                }
                return inner
              })
              // .map(item => {
              //   item.qlTypeString = genType(item)
              //   return item
              // })
              // .filter(item => item.name !== 'Transfer')
              // .filter(item => item.type !== 'constructor')
              // .reduce((total, current, index) => {
              //   // console.log(current)
              //   const fnName = current.name
              //   const { name, type } = current.inputs[0]
              //   console.log('--------')
              //   // console.log(current.outputs)
              //   console.log(getOutputType(current.outputs))
              //   console.log('--------')
              //   const graphQlType = abiToGraphQlType(type)
              //   const outGraphQLType = getOutputType(current.outputs)
              //   let template = `${fnName}(${name}: ${graphQlType}): ${outGraphQLType}`
              //   return (index === 0) ? total + template : total + '\n    ' + template
              // }, '')

// console.log(JSON.stringify(queryTypes, null, 2))
