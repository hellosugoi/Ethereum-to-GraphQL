const { buildSchema, graphql } = require('graphql')
const TFcontract = require('truffle-contract')
const MetaCoinArtifact = require('../build/contracts/Metacoin')
const MetCoinContract = TFcontract(MetaCoinArtifact)
MetCoinContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

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
      bytes32_1
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
      'bytes32_1': '0x0000000000000000000000000000000000000000000000000000000000000011',
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
