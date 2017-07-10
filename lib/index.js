const { buildSchema } = require('graphql')
const { genQueryTypes } = require('./createQLType')
const { genFnLines } = require('./createFnQueryLines')


const genFullSchema = ({ artifact, contract }) => {
  const { queryTypes } = genQueryTypes({ artifact, contract })
  const createFnQueryLines = genFnLines({ artifact })
  const baseScheme = `
    ${queryTypes}
    ${createFnQueryLines}
  `
  return buildSchema(baseScheme)
}

const genFullResolver = ({ artifact, contract }) => {
  const { allResolvers } = genQueryTypes({ artifact, contract })
  return allResolvers
}

const genGraphQlProperties = ({ artifact, contract }) => {
  const { queryTypes, allResolvers } = genQueryTypes({ artifact, contract })
  const createFnQueryLines = genFnLines({ artifact })
  const baseScheme = `
    ${queryTypes}
    ${createFnQueryLines}
  `
  return {
    schema: buildSchema(baseScheme),
    rootValue: allResolvers
  }
}

module.exports = {
  genGraphQlProperties,
  genFullSchema,
  genFullResolver
}
