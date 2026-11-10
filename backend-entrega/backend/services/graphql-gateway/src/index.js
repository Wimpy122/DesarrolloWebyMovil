const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');

const app = express();
const PORT = process.env.PORT || 4000;
const schemaText = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
const schema = buildSchema(schemaText);

app.use('/graphql', (req, res) => {
  return graphqlHTTP({ schema, rootValue: resolvers, graphiql: true })(req, res);
});

app.listen(PORT, () => console.log(`[GraphQL Gateway] en puerto ${PORT}`));
