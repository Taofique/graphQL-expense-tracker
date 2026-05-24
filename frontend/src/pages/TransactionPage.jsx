import { useState } from "react";
import TransactionFormSkeleton from "../components/skeletons/TransactionFormSkeleton";

const TransactionPage = () => {
  const [formData, setFormData] = useState({
    description: "",
    type: "expense",
    paymentType: "cash",
    category: "food",
    amount: "",
    location: "",
    date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA:", {
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col items-center px-4">
      <p className="md:text-4xl text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 text-transparent bg-clip-text">
        Update Transaction
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
          />
        </div>

        {/* TYPE (IMPORTANT) */}
        <div>
          <label className="text-white text-xs font-bold uppercase">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
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
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        {/* CATEGORY (FIXED ENUM) */}
        <div>
          <label className="text-white text-xs font-bold uppercase">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-200 text-black"
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
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="150"
            className="w-full p-3 rounded bg-gray-200 text-black"
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
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionPage;
