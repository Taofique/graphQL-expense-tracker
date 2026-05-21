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

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input createTransactionInput {
    text: String!
    amount: Float!
    type: String!
    category: String!
    date: String!
  }

  input UpdateTransactionInput {
    text: String
    amount: Float
    type: String
    category: String
    date: String
  }

  type Query {
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
    categoryStatistics: [CategoryStatistics!]!
  }

  type Mutation {
    createTransaction(input: createTransactionInput): Transaction
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction
    deleteTransaction(id: ID!): Transaction
  }
`;

export default transactionTypeDefs;
