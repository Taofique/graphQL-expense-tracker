import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";

const TransactionForm = () => {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transaction created successfully!");
      // Reset form
      const form = document.getElementById("transactionForm");
      if (form) form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: ["GetTransactions", "GetCategoryStatistics"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const transactionData = {
      description: formData.get("description"),
      type: formData.get("type"),
      paymentType: formData.get("paymentType"),
      category: formData.get("category"),
      amount: Number(formData.get("amount")),
      location: formData.get("location"),
      date: formData.get("date"),
    };

    // Validate required fields
    if (
      !transactionData.description ||
      !transactionData.amount ||
      !transactionData.date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createTransaction({
      variables: {
        input: transactionData,
      },
    });
  };

  return (
    <form
      id="transactionForm"
      className="w-full max-w-lg flex flex-col gap-5 px-3"
      onSubmit={handleSubmit}
    >
      {/* DESCRIPTION */}
      <div>
        <label className="block uppercase text-white text-xs font-bold mb-2">
          Description
        </label>
        <input
          className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          name="description"
          type="text"
          required
          placeholder="Rent, Salary, Groceries..."
        />
      </div>

      {/* TYPE */}
      <div>
        <label className="block uppercase text-white text-xs font-bold mb-2">
          Type
        </label>
        <select
          name="type"
          className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* PAYMENT TYPE + CATEGORY + AMOUNT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* PAYMENT TYPE */}
        <div>
          <label className="block uppercase text-white text-xs font-bold mb-2">
            Payment
          </label>
          <select
            name="paymentType"
            className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block uppercase text-white text-xs font-bold mb-2">
            Category
          </label>
          <select
            name="category"
            className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          <label className="block uppercase text-white text-xs font-bold mb-2">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            placeholder="150"
            className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* LOCATION + DATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block uppercase text-white text-xs font-bold mb-2">
            Location
          </label>
          <input
            name="location"
            type="text"
            placeholder="Dhaka"
            className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block uppercase text-white text-xs font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            required
            className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* BUTTON */}
      <button
        className="text-white font-bold w-full rounded px-4 py-3 bg-gradient-to-br from-pink-500 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding Transaction..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
