import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { GET_TRANSACTION } from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import TransactionFormSkeleton from "../components/skeletons/TransactionFormSkeleton";
import toast from "react-hot-toast";

const TransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdateMode = id && id !== "new";

  // Check if user is authenticated
  const { data: authData, loading: authLoading } = useQuery(
    GET_AUTHENTICATED_USER
  );

  // Get transaction data if in update mode
  const { data: transactionData, loading: transactionLoading } = useQuery(
    GET_TRANSACTION,
    {
      variables: { id },
      skip: !isUpdateMode,
    }
  );

  const [formData, setFormData] = useState({
    description: "",
    type: "expense",
    paymentType: "cash",
    category: "food",
    amount: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Populate form with existing data when in update mode
  useEffect(() => {
    if (transactionData?.transaction) {
      const t = transactionData.transaction;
      setFormData({
        description: t.description || "",
        type: t.type || "expense",
        paymentType: t.paymentType || "cash",
        category: t.category || "food",
        amount: t.amount?.toString() || "",
        location: t.location || "",
        date: t.date || new Date().toISOString().split("T")[0],
      });
    }
  }, [transactionData]);

  // Update transaction mutation
  const [updateTransaction, { loading: updateLoading }] = useMutation(
    UPDATE_TRANSACTION,
    {
      onCompleted: () => {
        toast.success("Transaction updated successfully!");
        // ✅ Redirect to home page after successful update
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      refetchQueries: ["GetTransactions", "GetCategoryStatistics"],
    }
  );

  // If not authenticated, redirect to login
  if (!authLoading && !authData?.authUser) {
    return <Navigate to="/login" />;
  }

  if (authLoading || transactionLoading) {
    return <TransactionFormSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const input = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (isUpdateMode) {
      await updateTransaction({
        variables: {
          id,
          input,
        },
      });
    } else {
      // Create mode - handled by TransactionForm component
      toast.error(
        "Please use the TransactionForm component to create transactions"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col items-center px-4">
      <p className="md:text-4xl text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 text-transparent bg-clip-text">
        {isUpdateMode ? "Update Transaction" : "Create Transaction"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col gap-5"
      >
        {/* DESCRIPTION */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Description
          </label>
          <input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Rent, Groceries, Salary..."
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="text-white text-xs font-bold uppercase">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* PAYMENT TYPE */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Payment Type
          </label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          >
            <option value="food">Food</option>
            <option value="housing">Housing</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="investment">Investment</option>
            <option value="saving">Saving</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* AMOUNT */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="150"
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Location
          </label>
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Dhaka"
            className="w-full p-3 rounded bg-gray-200 text-black"
          />
        </div>

        {/* DATE */}
        <div>
          <label className="text-white text-xs font-bold uppercase">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateLoading
            ? "Updating..."
            : isUpdateMode
              ? "Update Transaction"
              : "Create Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionPage;
