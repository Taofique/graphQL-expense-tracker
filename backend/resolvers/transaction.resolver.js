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

    updateTransaction: async (_, { id, input }, context) => {
      // Check if user is authenticated
      if (!context.currentUser) {
        throw new Error("Not authenticated");
      }

      // Check if ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      // Find transaction and ensure it belongs to the user
      const transaction = await Transaction.findOne({
        _id: id,
        userId: context.currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Update only the fields provided in input
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      return updatedTransaction;
    },

    deleteTransaction: async (_, { id }, context) => {
      // Check if user is authenticated
      if (!context.currentUser) {
        throw new Error("Not authenticated");
      }

      // Check if ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      // Find transaction and ensure it belongs to the user
      const transaction = await Transaction.findOne({
        _id: id,
        userId: context.currentUser._id,
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Delete the transaction
      await Transaction.findByIdAndDelete(id);

      // Return the deleted transaction data
      return transaction;
    },
  },
};

export default transactionResolvers;
