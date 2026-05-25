import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/ui/Cards";
import TransactionForm from "../components/ui/TransactionForm";
import { MdLogout } from "react-icons/md";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { useMutation, useApolloClient } from "@apollo/client";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = ({ onLogout }) => {
  const loading = false;
  const client = useApolloClient();

  const transactions = [
    {
      _id: "1",
      description: "Salary",
      paymentType: "cash",
      category: "saving",
      amount: 3000,
      location: "Dhaka",
      date: "2026-05-24",
    },
    {
      _id: "2",
      description: "Groceries",
      paymentType: "card",
      category: "expense",
      amount: 120,
      location: "Khulna",
      date: "2026-05-20",
    },
    {
      _id: "3",
      description: "Stocks",
      paymentType: "card",
      category: "investment",
      amount: 500,
      location: "Dhaka",
      date: "2026-05-18",
    },
  ];

  const chartData = {
    labels: ["Saving", "Expense", "Investment"],
    datasets: [
      {
        label: "Transactions",
        data: [13, 8, 3],
        backgroundColor: [
          "rgba(34,197,94,0.8)",
          "rgba(236,72,153,0.8)",
          "rgba(59,130,246,0.8)",
        ],
        borderWidth: 2,
        borderRadius: 12,
        spacing: 4,
        cutout: "70%",
      },
    ],
  };

  const [logout, { loading: logoutLoading }] = useMutation(LOGOUT, {
    onCompleted: async () => {
      toast.success("Logged out successfully!");
      await client.clearStore();
      await onLogout();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col gap-10 items-center max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <p className="md:text-4xl text-2xl font-bold text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
          Spend wisely, track wisely
        </p>

        <img
          src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
          className="w-11 h-11 rounded-full border cursor-pointer"
          alt="Avatar"
        />

        {!logoutLoading ? (
          <MdLogout
            className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
            onClick={() => logout()}
          />
        ) : (
          <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
        )}
      </div>

      {/* CHART + FORM */}
      <div className="flex flex-wrap w-full justify-center items-center gap-10">
        <div className="h-[320px] w-[320px] md:h-[360px] md:w-[360px]">
          <Doughnut data={chartData} />
        </div>
        <TransactionForm />
      </div>

      {/* TRANSACTION CARDS */}
      <Cards transactions={transactions} />
    </div>
  );
};

export default HomePage;
