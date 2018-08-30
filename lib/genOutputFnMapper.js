const Web3 = require('web3')
const web3 = new Web3()

const parseValueResult = (data) => {
  return {
    string: data.toString(),
    int: data.toNumber()
  }
}

const parseBytesResult = (data) => {
  return {
    raw: data,
    decoded: web3.utils.hexToAscii(data).replace(/\0/g, '')
  }
}

const zipOutputWithResults = (resultsIsArr, outputTypesDefIsArray, result, outputTypesDef) => {
  return outputTypesDef.map((item, index) => {
    if (typeof result[index] === 'undefined' || typeof result === 'string' || resultsIsArr) {
      item.result = result
    } else {
      item.result = result[index]
    }

    return item
  })
}

const genOutputFn = (outputTypesDef) => {
  return (result) => {
    const resultsIsArr = Array.isArray(result)
    const outputTypesDefIsArray = Array.isArray(outputTypesDef)
    const combined = zipOutputWithResults(resultsIsArr, outputTypesDefIsArray, result, outputTypesDef)
    return combined.reduce((out, current) => {
      let { key, name, result } = current
      if (key === 'value') {
        if (Array.isArray(result)) {
          out[name] = result.map(item => {
            return parseValueResult(item)
          })
        } else {
          out[name] = parseValueResult(result)
        }
      } else if (key === 'bytes') {
        if (Array.isArray(result)) {
          out[name] = result.map(item => {
            return parseBytesResult(item)
          })
        } else {
          out[name] = parseBytesResult(result)
        }
      } else {
        out[name] = result
      }
      return out
    }, {})
  }
}

// Pupose of this method is to create the function that will receive data from Ethereum and return to graphQL for further processing
const genOutputFnMapper = ({ queryConverter }) => {
  return queryConverter
                .map(item => {
                  return { fnName: item.name, outputMapper: genOutputFn(item.types) }
                })
                .reduce((out, cur) => {
                  out[cur.fnName] = cur.outputMapper
                  return out
                }, {})
}

module.exports = {
  genOutputFnMapper
}
