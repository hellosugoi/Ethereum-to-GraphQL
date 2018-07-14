const { buildSchema, graphql } = require('graphql')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('../build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

const contractOwner = '0x7937d8523b90910d5cb3fb3cf2bd739e13183350' // 0 address with mneonic of "lol dude" in ganache

//
// const { genFullSchema, genFullResolver } = require('./lib/index')
// const schema = genFullSchema({ artifact: MetaCoinArtifact, contract: MetCoinContract })
// const rootValue = genFullResolver({ artifact: MetaCoinArtifact, contract: MetCoinContract })

const { genGraphQlProperties } = require('../lib/index')
const { schema, rootValue } = genGraphQlProperties({ artifact: MetaCoinArtifact, contract: MetCoinContract })

it('should succesfully query a public uint value', async () => {
  const query = `
    query {
      candy {
        uint256_0 {
          string
          int
        }
      }
    }
  `
  const result = await graphql(schema, query, rootValue)
  expect(result.data).toEqual({
    'candy': {
      'uint256_0': {
        'string': '6',
        'int': 6
      }
    }
  })
})

it('should succesfully query a source string value', async () => {
  const query = `
    query {
      source {
        string_0
      }
    }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(result)
  expect(result.data).toEqual({
    'source': {
      'string_0': 'source'
    }
  })
})

it('should succesfully query getBalance', async () => {
  const query = `
  query {
    getBalance(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
      uint256_0 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  expect(result.data).toEqual({
    'getBalance': {
      'uint256_0': {
        'string': '0',
        'int': 0
      }
    }
  })
})

it('should succesfully query getBalanceInEth', async () => {
  const query = `
  query {
    getBalanceInEth(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
      uint256_0 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'getBalanceInEth': {
      'uint256_0': {
        'string': '0',
        'int': 0
      }
    }
  })
})

it('should succesfully query returns3 with multiple outputs', async () => {
  const query = `
  query {
    returns3 {
      string_0
      bytes32_1 {
        raw
        decoded
      }
      uint256_2 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'returns3': {
      'string_0': 'hey',
      'bytes32_1': {
        'raw': '0x0000000000000000000000000000000000000000000000000000000000000011',
        'decoded': '\u0011'
      },
      'uint256_2': {
        'string': '600',
        'int': 600
      }
    }
  })
})

it('should succesfully query returns2 with multiple inputs/outputs', async () => {
  const query = `
  query {
    returns2(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8d" num: 1) {
      bool_1
      uint256_0 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result.data, null, 2))
  expect(result.data).toEqual({
    'returns2': {
      'bool_1': true,
      'uint256_0': {
        'string': '0',
        'int': 0
      }
    }
  })
})

it('should succesfully query returnsSingleUint8', async () => {
  const query = `
  query {
    returnsSingleUint8 {
      uint8_0 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result.data, null, 2))
  expect(result.data).toEqual({
    'returnsSingleUint8': {
      'uint8_0': {
        'string': '11',
        'int': 11
      }
    }
  })
})

it('should succesfully query returnsNamedInt', async () => {
  const query = `
  query {
    returnsNamedInt {
      tweleve {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result.data, null, 2))
  expect(result.data).toEqual({
    'returnsNamedInt': {
      'tweleve': {
        'string': '12',
        'int': 12
      }
    }
  })
})

it('should succesfully query returnsMixedNamedInt', async () => {
  const query = `
  query {
    returnsMixedNamedInt {
      num {
        string
        int
      }
      uint32_1 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result.data, null, 2))
  expect(result.data).toEqual({
    'returnsMixedNamedInt': {
      'num': {
        'string': '13',
        'int': 13
      },
      'uint32_1': {
        'string': '14',
        'int': 14
      }
    }
  })
})

it('should succesfully query returnsaddress', async () => {
  const query = `
  query {
    returnsaddress {
      address_0
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result.data, null, 2))
  expect(result.data).toEqual({
    'returnsaddress': {
      'address_0': contractOwner
    }
  })
})

it('should succesfully query returnsEnum', async () => {
  const query = `
  query {
    returnsEnum {
      int256_0 {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'returnsEnum': {
      'int256_0': {
        'string': '3',
        'int': 3
      }
    }
  })
})

it('should succesfully query returnsArrayInt', async () => {
  const query = `
  query {
    returnsArrayInt {
      uint256Arr_0 {
        string
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'returnsArrayInt': {
      'uint256Arr_0': [
        {
          'string': '2'
        }, {
          'string': '5'
        }
      ]
    }
  })
})

it('should succesfully query returnsArrayAddresses', async () => {
  const query = `
  query {
    returnsArrayAddresses {
      addressArr_0
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'returnsArrayAddresses': {
      'addressArr_0': [
        '0x0000000000000000000000000000000000000004',
        '0x0000000000000000000000000000000000000007',
        '0x0000000000000000000000000000000000000009'
      ]
    }
  })
})

it('should succesfully query returnsArrayBytes', async () => {
  const query = `
  query {
    returnsArrayBytes {
      bytes32Arr_0 {
        decoded
        raw
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue)
  // console.log(JSON.stringify(result, null, 2))
  expect(result.data).toEqual({
    'returnsArrayBytes': {
      'bytes32Arr_0': [
        {
          'decoded': 'uno',
          'raw': '0x756e6f0000000000000000000000000000000000000000000000000000000000'
        },
        {
          'decoded': 'dos',
          'raw': '0x646f730000000000000000000000000000000000000000000000000000000000'
        },
        {
          'decoded': 'tres',
          'raw': '0x7472657300000000000000000000000000000000000000000000000000000000'
        }
      ]
    }
  })
})
