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
  return queryName
}

const mapOutputType = (type, isArray) => {
  let outTypeName = ''
  if (type.includes('int')) {
    outTypeName = 'Value'
  } else if (type.includes('bool')) {
    outTypeName = 'Boolean'
  } else if (type.includes('bytes')) {
    outTypeName = 'Bytes'
  } else if (type.includes('address')) {
    outTypeName = 'String'
  } else if (type === 'string') {
    outTypeName = 'String'
  } else {
    throw new Error(`Unknown Output type of ${type}`)
  }

  if (isArray) {
    outTypeName = `[${outTypeName}]`
  }
  return outTypeName
}

const keyParserMap = {
  'Value': 'value',
  '[Value]': 'value',
  'Boolean': 'boolean',
  '[Boolean]': 'boolean',
  'Bytes': 'bytes',
  '[Bytes]': 'bytes',
  'String': 'string',
  '[String]': 'string',
  'Address': 'address',
  '[Address]': 'address'
}

const abiOutputToGraphQLType = (input, index) => {
  const { type } = input
  const isArray = type.includes('[]')
  let graphQlType = mapOutputType(type, isArray)
  const parseKey = keyParserMap[graphQlType]
  const name = convertTypeToGraphQLName(input, index)
  return {
    key: parseKey,
    value: graphQlType,
    name,
    index
  }
}

// Pupose of this method is to create a clean object so the methods after this can properly construct themeselves.
const genQueryConverter = ({ artifact: { abi } }) => {
  return abi
          .filter(item => typeof item.outputs !== 'undefined')
          .map(item => {
            return {
              name: item.name,
              outputs: item.outputs
            }
          })
          .map(item => {
            item.types = item.outputs.map(abiOutputToGraphQLType)
            return item
          })
}

module.exports = {
  genQueryConverter
}
