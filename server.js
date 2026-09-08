const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const { Usuario, sequelize } = require('./models/usuario');

// 1. Definición del Schema (typeDefs) - Se mantiene exactamente igual
const typeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    pass: String!
  }

  type Alert {
    message: String
  }

  input UsuarioInput {
    nombre: String!
    pass: String!
  }

  type Query {
    getUsuarios(limit: Int, offset: Int): [Usuario]
    getUsuariosById(id: ID!): Usuario
  }

  type Mutation {
    addUsuario(input: UsuarioInput): Usuario
    updUsuario(id: ID!, input: UsuarioInput): Usuario
    delUsuario(id: ID!): Alert
  }
`;

// 2. Resolvers adaptados a Sequelize (MySQL)
const resolvers = {
  Query: {
    getUsuarios: async (_, { limit = 10, offset = 0 }) => {
      // Sequelize usa directamente 'limit' y 'offset'
      return await Usuario.findAll({ limit, offset });
    },
    getUsuariosById: async (obj, { id }) => {
      const usuarioBus = await Usuario.findByPk(id);
      if (!usuarioBus) {
        return null;
      }
      return usuarioBus;
    }
  },
  Mutation: {
    addUsuario: async (_, { input }) => {
      return await Usuario.create(input);
    },
    updUsuario: async (_, { id, input }) => {
      await Usuario.update(input, { where: { id } });
      return await Usuario.findByPk(id); // Devolvemos el usuario actualizado
    },
    delUsuario: async (_, { id }) => {
      await Usuario.destroy({ where: { id } });
      return { message: "Usuario eliminado correctamente" };
    }
  }
};

// 3. Inicialización del servidor Express y Apollo
async function startServer() {
  const app = express();
  app.use(cors());

  // Autenticación y sincronización con MySQL
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL correctamente.');
    // .sync() crea la tabla automáticamente si no existe
    await sequelize.sync(); 
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
  }

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Graphql Iniciado en http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();