
import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Navbar from './components/Navbar';

// Set up Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Adjust the URI to match your GraphQL server endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
