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
    if (type.includes('[]')) {
      return { key: 'bytes32', value: '[Bytes]', name, index }
    }
    return { key: 'bytes32', value: 'Bytes', name, index }
  }

  if (type.includes('address')) {
    if (type.includes('[]')) {
      return { key: 'address', value: '[String]', name, index }
    }
    return { key: 'address', value: 'String', name, index }
  }

  return new Error(`Unkown abi output type: ${type}`)
}

const genQueryConverter = ({ artifact }) => {
  const { abi } = artifact
  return abi
          .filter(item => typeof item.outputs !== 'undefined')
          .map(item => { return { name: item.name, outputs: item.outputs } })
          .map(item => {
            // console.log(item)
            item.types = item.outputs.map(abiOutputToGraphQLType)
            return item
          })
}

module.exports = {
  genQueryConverter
}
