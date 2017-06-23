import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import mocks from './mocks';

const typeDefinitions = `
type Query {
  testString: String
}

schema {
  query: Query
}
`;

const schema = makeExecutableSchema({ typeDefs: typeDefinitions });
addMockFunctionsToSchema({ schema, mocks });
export default schema;
