const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const chunks = [];
      const stream = createReadStream();

      stream.once('error', err => {
        console.error(err);
      });

      stream.on('data', chunk => {
        chunks.push(chunk);
      });

      stream.once('end', () => {
        const buffer = Buffer.concat(chunks);

        const formData = new FormData();
        formData.append('file', buffer, {
          filename: filename,
          contentType: mimetype
        });

        fetch('http://localhost:8080/uploadFile', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(res => console.log(res))
          .catch(err => console.log('err', err));
      });

      return { filename, mimetype, encoding };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
