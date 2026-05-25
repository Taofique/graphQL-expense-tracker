const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    gender: String!
    profilePicture: String
  }

  type LogoutResponse {
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
    logout: LogoutResponse
  }

  type Query {
    _placeholder: String
    authUser: User
  }
`;

export default userTypeDef;
