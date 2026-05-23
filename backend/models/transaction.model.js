import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card", "crypto"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "saving",
        "housing",
        "food",
        "transport",
        "entertainment",
        "health",
        "investment",
        "other",
      ],
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ ADD THIS RIGHT HERE 👇
transactionSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.createdAt = ret.createdAt?.toISOString?.();
    ret.updatedAt = ret.updatedAt?.toISOString?.();

    // optional cleanup (recommended)
    delete ret.__v;
    return ret;
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
