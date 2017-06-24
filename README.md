# apollo-tutorial-kit (formerly apollo-starter-kit)

Starting point for the Apollo GraphQL Server tutorial.

See also [Tutorial: How to build a GraphQL server](https://medium.com/apollo-stack/tutorial-building-a-graphql-server-cddaa023c035#.wy5h1htxs) and the solution in the `server-tutorial-solution` branch of this repo.

Up-to-date documentation and explanations for Apollo Server can be found on [docs.apollostack.com](http://dev.apollodata.com/tools/apollo-server/index.html)

## Getting started

```sh
git clone https://github.com/apollostack/apollo-starter-kit
cd apollo-starter-kit
npm install
npm run start
```

Then open [http://localhost:3000/graphiql](http://localhost:3000/graphql)

When you paste this on the left side of the page:

```
{
  testString
}
```

and hit the play button (cmd-return), then you should get this on the right side:

```json
{
  "data": {
    "testString": "It works!"
  }
}
```  
