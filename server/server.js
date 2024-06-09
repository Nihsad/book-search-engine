const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./auth');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schema');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { user } = authMiddleware({ req });
    return { user };
  }
});

// Apply Apollo GraphQL middleware to the Express server
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Use existing routes
  app.use(routes);

  // Connect to the database and start the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
