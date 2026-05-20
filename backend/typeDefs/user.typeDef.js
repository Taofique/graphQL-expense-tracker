const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    gender: String!
    profilePicture: String
  }

  type logoutResponse {
    message: String!
  }

  input SignUpInput {
    username: String!
    name: String!
    password: String!
    gender: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: logoutResponse
  }

  # Add this Query type
  type Query {
    _placeholder: String
    authUser: User
  }
`;

export default userTypeDef;
