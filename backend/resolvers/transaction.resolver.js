// import mongoose from "mongoose";
// import Transaction from "../models/transaction.model.js";

// const transactionResolvers = {
//   Query: {
//     transactions: async (_, __, context) => {
//       if (!context.currentUser) {
//         throw new Error("Not authenticated");
//       }

//       const transactions = await Transaction.find({
//         userId: context.currentUser._id,
//       }).sort({ date: -1 });

//       return transactions;
//     },

//     transaction: async (_, { id }, context) => {
//       if (!context.currentUser) {
//         throw new Error("User not authenticated");
//       }

//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error("Invalid transaction ID format");
//       }

//       const transaction = await Transaction.findOne({
//         _id: id,
//         userId: context.currentUser._id,
//       });

//       if (!transaction) {
//         throw new Error("Transaction not found");
//       }

//       return transaction;
//     },

//     categoryStatistics: async (_, __, context) => {
//       // Check if user is authenticated
//       if (!context.currentUser) {
//         throw new Error("Not authenticated");
//       }

//       // Use MongoDB aggregation pipeline to group by category and sum amounts
//       const statistics = await Transaction.aggregate([
//         // Match only transactions belonging to the authenticated user
//         {
//           $match: {
//             userId: new mongoose.Types.ObjectId(context.currentUser._id),
//           },
//         },
//         // Group by category and calculate total amount
//         {
//           $group: {
//             _id: "$category",
//             totalAmount: { $sum: "$amount" },
//           },
//         },
//         // Project to rename _id to category
//         {
//           $project: {
//             category: "$_id",
//             totalAmount: 1,
//             _id: 0,
//           },
//         },
//         // Sort alphabetically by category name
//         {
//           $sort: { category: 1 },
//         },
//       ]);

//       return statistics;
//     },
//   },

//   Mutation: {
//     createTransaction: async (_, { input }, context) => {
//       if (!context.currentUser) {
//         throw new Error("Not authenticated");
//       }

//       const transaction = new Transaction({
//         ...input,
//         userId: context.currentUser._id,
//       });

//       await transaction.save();
//       return transaction;
//     },

//     updateTransaction: async (_, { id, input }, context) => {
//       // Check if user is authenticated
//       if (!context.currentUser) {
//         throw new Error("Not authenticated");
//       }

//       // Check if ID is valid MongoDB ObjectId
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error("Invalid transaction ID format");
//       }

//       // Find transaction and ensure it belongs to the user
//       const transaction = await Transaction.findOne({
//         _id: id,
//         userId: context.currentUser._id,
//       });

//       if (!transaction) {
//         throw new Error("Transaction not found");
//       }

//       // Update only the fields provided in input
//       const updatedTransaction = await Transaction.findByIdAndUpdate(
//         id,
//         { $set: input },
//         { new: true, runValidators: true }
//       );

//       return updatedTransaction;
//     },

//     deleteTransaction: async (_, { id }, context) => {
//       // Check if user is authenticated
//       if (!context.currentUser) {
//         throw new Error("Not authenticated");
//       }

//       // Check if ID is valid MongoDB ObjectId
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error("Invalid transaction ID format");
//       }

//       // Find transaction and ensure it belongs to the user
//       const transaction = await Transaction.findOne({
//         _id: id,
//         userId: context.currentUser._id,
//       });

//       if (!transaction) {
//         throw new Error("Transaction not found");
//       }

//       // Delete the transaction
//       await Transaction.findByIdAndDelete(id);

//       // Return the deleted transaction data
//       return transaction;
//     },
//   },
// };

// export default transactionResolvers;

import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

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

      // Use MongoDB aggregation pipeline to group by category and sum amounts
      const statistics = await Transaction.aggregate([
        // Match only transactions belonging to the authenticated user
        {
          $match: {
            userId: new mongoose.Types.ObjectId(currentUser._id),
          },
        },
        // Group by category and calculate total amount
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        // Project to rename _id to category
        {
          $project: {
            category: "$_id",
            totalAmount: 1,
            _id: 0,
          },
        },
        // Sort alphabetically by category name
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

      const transaction = new Transaction({
        ...input,
        userId: currentUser._id,
      });

      await transaction.save();
      return transaction;
    },

    updateTransaction: async (_, { id, input }, context) => {
      const currentUser = getCurrentUser(context);
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      // Check if ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      // Find transaction and ensure it belongs to the user
      const transaction = await Transaction.findOne({
        _id: id,
        userId: currentUser._id,
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
      const currentUser = getCurrentUser(context);
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      // Check if ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid transaction ID format");
      }

      // Find transaction and ensure it belongs to the user
      const transaction = await Transaction.findOne({
        _id: id,
        userId: currentUser._id,
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
