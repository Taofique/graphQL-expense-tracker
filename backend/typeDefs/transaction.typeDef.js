const transactionTypeDefs = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    amount: Float!
    type: String!
    paymentType: String!
    category: String!
    location: String
    date: String!
    createdAt: String
    updatedAt: String
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input createTransactionInput {
    description: String!
    amount: Float!
    type: String!
    paymentType: String!
    category: String!
    location: String
    date: String!
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: String
    paymentType: String
    category: String
    location: String
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
