import mongoose from "mongoose";
import Transaction from "../models/transaction.model";

const transactionResolvers = {
  Query: {
    transactions: async (_, __, context) => {
      if (!context.currentUser) {
        throw new Error("Not authenticated");
      }

      const transactions = await Transaction.find({
        userId: context.currentUser._id,
      }).sort({ date: -1 });

      return transactions;
    },

    transaction: async (_, { id }, context) => {
      if (!context.currentUser) {
        throw new Error("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      const transaction = await Transaction.findOne({
        _id: id,
        userId: context.currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return transaction;
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      if (!context.currentUser) {
        throw new Error("Not authenticated");
      }

      const transaction = new Transaction({
        ...input,
        userId: context.currentUser._id,
      });

      await transaction.save();
      return transaction;
    },
  },
};

export default transactionResolvers;
