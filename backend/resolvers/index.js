import { mergeResolvers } from "@graphql-tools/merge";

import userResolvers from "./user.resolver.js";
import transactionResolvers, {
  TransactionFieldResolvers,
} from "./transaction.resolver.js";

const mergedResolvers = mergeResolvers([
  userResolvers,
  transactionResolvers,
  TransactionFieldResolvers,
]);

export default mergedResolvers;
