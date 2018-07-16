const { buildSchema } = require('graphql')
const { genQueryConverter } = require('./genQueryConverter')
const { genQueryTypeSchema } = require('./genQueryTypeSchema')
const { genOutputFnMapper } = require('./genOutputFnMapper')
const { genResolvers } = require('./genResolvers')
const { genFnLines } = require('./createFnQueryLines')

const genGraphQlProperties = ({ artifact, contract }) => {
  const queryConverter = genQueryConverter({ artifact })
  const queryTypes = genQueryTypeSchema({ queryConverter })
  const outputHandlers = genOutputFnMapper({ queryConverter })
  const allResolvers = genResolvers({ outputHandlers, artifact, contract })
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
