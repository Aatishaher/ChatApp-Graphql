import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './index.css'
import client from './Auth.js'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={
      client
    }>
    <App />
    </ApolloProvider>
  </StrictMode>,
)
