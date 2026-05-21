import Transaction from "../models/transaction.model";

const transactionResolvers = {
  Query: {},
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
