import { FaWallet, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const TransactionSummary = ({ transactions }) => {
  const totalSavings = transactions
    .filter((transaction) => transaction.category === "saving")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const remainingBalance = totalSavings - totalExpenses;

  return (
    <div className="w-full max-w-6xl rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500 shadow-xl p-8 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <FaWallet className="text-cyan-400 text-3xl" />
        <h2 className="text-3xl font-bold text-white">Financial Summary</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Savings */}
        <div className="bg-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaArrowTrendUp className="text-green-400" />
            <p className="text-gray-300 font-semibold">Total Savings</p>
          </div>

          <p className="text-3xl font-bold text-green-400">
            ${totalSavings.toFixed(2)}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaArrowTrendDown className="text-red-400" />
            <p className="text-gray-300 font-semibold">Total Expenses</p>
          </div>

          <p className="text-3xl font-bold text-red-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        {/* Remaining */}
        <div className="bg-slate-700 rounded-xl p-6">
          <p className="text-gray-300 font-semibold mb-3">Remaining Balance</p>

          <p
            className={`text-3xl font-bold ${
              remainingBalance >= 0 ? "text-cyan-400" : "text-red-500"
            }`}
          >
            ${remainingBalance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
