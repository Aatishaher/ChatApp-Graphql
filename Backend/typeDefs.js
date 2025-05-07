const gql = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  scalar DateTime

  type Message {
    id: ID!
    reciver: User!
    sender: User!
    message: String!
    createdAt: DateTime!
  }

  type Query {
    users(sender:ID!): [User!]!
    messagesbyUser(reciver:ID!,sender:ID!): [Message!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createMessage(reciver: ID!,sender:ID!, message: String!): Message!
  }

  type Subscription {
    messageSent(reciver:ID!,sender:ID!): Message
  }
`;

module.exports = typeDefs;
