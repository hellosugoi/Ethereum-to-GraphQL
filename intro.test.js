
const { buildSchema, graphql } = require('graphql');
const { queryTypes, allResolvers } = require('./lib/createQLType')
const createFnQueryLines = require('./lib/createFnQueryLines')
const schemaSource = `
${queryTypes}
${createFnQueryLines}
`

const schema = buildSchema(schemaSource)
const rootValue = allResolvers

it('should succesfully query a public uint value', async () => {
  const query = `
    query {
      candy {
        value {
          string
          int
        }
      }
    }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({'candy':{'value':{'string':'6','int':6}}})
})

it('should succesfully query a source string value', async () => {
  const query = `
    query {
      source {
    		string
      }
    }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({ 'source': { 'string': 'source' } })
})

it('should succesfully query getBalance', async () => {
  const query = `
  query {
    getBalance(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
      value {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({'getBalance':{'value':{'string':'0','int':0}}})
})

it('should succesfully query getBalanceInEth', async () => {
  const query = `
  query {
    getBalanceInEth(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
      value {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({'getBalanceInEth':{'value':{'string':'0','int':0}}})
})

it('should succesfully query other with multiple outputs', async () => {
  const query = `
  query {
    other {
  		string
      bytes32
      value {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({'other':{'string':'hey','bytes32':'0x0000000000000000000000000000000000000000000000000000000000000011','value':{'string':'600','int':600}}})
})

it('should succesfully query returns2 with multiple inputs/outputs', async () => {
  const query = `
  query {
    returns2(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8d" num: 1) {
  		boolean
      value {
        string
        int
      }
    }
  }
  `
  const result = await graphql(schema, query, rootValue);
  expect(result.data).toEqual({'returns2':{'boolean':true,'value':{'string':'10000','int':10000}}})
})
