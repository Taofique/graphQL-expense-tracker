const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    gender: String!
    profilePicture: String
  }

  input SignUpInput {
    username: String!
    name: String!
    password: String!
    gender: String!
  }

  type Mutation {
    signUp(input: SignUpInput!): User
  }

  # Add this Query type
  type Query {
    _placeholder: String
  }
`;

export default userTypeDef;
