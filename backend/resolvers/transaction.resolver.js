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
