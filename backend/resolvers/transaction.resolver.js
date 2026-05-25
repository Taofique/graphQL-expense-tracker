import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

// Helper function to get current user from either session or context
const getCurrentUser = (context) => {
  return context.req?.session?.user || context.currentUser;
};

const transactionResolvers = {
  Query: {
    transactions: async (_, __, context) => {
      const currentUser = getCurrentUser(context);
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      const transactions = await Transaction.find({
        userId: currentUser._id,
      }).sort({ date: -1 });

      return transactions;
    },

    transaction: async (_, { id }, context) => {
      const currentUser = getCurrentUser(context);
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      const transaction = await Transaction.findOne({
        _id: id,
        userId: currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return transaction;
    },

    categoryStatistics: async (_, __, context) => {
      const currentUser = getCurrentUser(context);
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      const statistics = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(currentUser._id),
          },
        },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            category: "$_id",
            totalAmount: 1,
            _id: 0,
          },
        },
        {
          $sort: { category: 1 },
        },
      ]);

      return statistics;
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      const currentUser = getCurrentUser(context);

      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      const transaction = await Transaction.create({
        ...input,
        userId: currentUser._id,
      });

      return {
        ...transaction.toObject(),
        createdAt: transaction.createdAt?.toISOString(),
        updatedAt: transaction.updatedAt?.toISOString(),
      };
    },

    updateTransaction: async (_, { id, input }, context) => {
      const currentUser = getCurrentUser(context);

      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      const transaction = await Transaction.findOne({
        _id: id,
        userId: currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      return updatedTransaction;
    },

    deleteTransaction: async (_, { id }, context) => {
      const currentUser = getCurrentUser(context);

      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      const transaction = await Transaction.findOne({
        _id: id,
        userId: currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      await Transaction.findByIdAndDelete(id);

      return transaction;
    },
  },
};

export const TransactionFieldResolvers = {
  Transaction: {
    user: async (parent) => {
      try {
        const user = await User.findById(parent.userId);
        return user;
      } catch (err) {
        console.error("Error getting user for transaction:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolvers;
