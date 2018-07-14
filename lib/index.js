const { buildSchema } = require('graphql')
const { genFnLines } = require('./createFnQueryLines')
const { genQueryConverter } = require('./genQueryConverter')
const { genQueryTypeSchema } = require('./genQueryTypeSchema')
const { genOutputFnMapper } = require('./genOutputFnMapper')

const genGraphQlProperties = ({ artifact, contract }) => {
  const queryConverter = genQueryConverter({ artifact })
  const queryTypes = genQueryTypeSchema({ queryConverter })
  const { allResolvers } = genOutputFnMapper({ queryConverter, artifact, contract })
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
