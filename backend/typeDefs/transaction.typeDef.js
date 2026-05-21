const transactionTypeDefs = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    text: String!
    amount: Float!
    type: String!
    category: String!
    date: String!
    createdAt: String
    updatedAt: String
  }

  input createTransactionInput {
    text: String!
    amount: Float!
    type: String!
    category: String!
    date: String!
  }

  type Query {
    transactions: [Transaction!]!
  }

  type Mutation {
    createTransaction(input: createTransactionInput): Transaction
  }
`;

export default transactionTypeDefs;
