
const { buildSchema, graphql } = require('graphql');

const temporary2 = `
type Value {
  string: String
  int: Int
}
type candy {
  value: Value
}
type Query {
  candy: candy
}
`
const schema = buildSchema(temporary2)

const getCandy = require('./lib/methods/getCandy')


it('should query a public uint value', async () => {
  const query = `
    query {
      candy {
        value {
          string
          int
        }
      }
    }
  `;

  const rootValue = {
    candy: () => {
      return getCandy()
    }
  };

  const result = await graphql(schema, query, rootValue);
  // const { data } = result;
  console.log(result)

  // expect(data.viewer.me).toBe(null);
});
