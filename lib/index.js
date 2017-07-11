const { buildSchema } = require('graphql')
const { genQueryTypes } = require('./createQLType')
const { genFnLines } = require('./createFnQueryLines')

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
  genGraphQlProperties
}
