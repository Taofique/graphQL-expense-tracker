import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      description
      amount
      type
      paymentType
      category
      location
      date
      user {
        _id
        username
        name
        profilePicture
      }
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      _id
      description
      amount
      type
      paymentType
      category
      location
      date
      user {
        _id
        username
        name
        profilePicture
      }
    }
  }
`;

export const GET_CATEGORY_STATISTICS = gql`
  query GetCategoryStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;
