import {
  makeExecutableSchema,
  // addMockFunctionsToSchema,
} from 'graphql-tools';
// import mocks from './mocks'
import resolvers from './resolvers'

const typeDefs = `
type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
}
type Balance {
  balance: Int
}
type BigInt {
  string: String
  int: Int
}
type Query {
  testString: String
  author(firstName: String, lastName: String): Author
  getFortuneCookie: String # we'll use this later
  metaCoin: Int
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// addMockFunctionsToSchema({ schema, mocks });

export default schema;
