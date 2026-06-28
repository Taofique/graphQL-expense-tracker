import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/ui/Cards";
import TransactionForm from "../components/ui/TransactionForm";
import TransactionSummary from "../components/ui/TransactionSummary";
import { MdLogout } from "react-icons/md";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import {
  GET_TRANSACTIONS,
  GET_CATEGORY_STATISTICS,
} from "../graphql/queries/transaction.query";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = ({ onLogout }) => {
  const client = useApolloClient();

  const { data: transactionsData, loading: transactionsLoading } =
    useQuery(GET_TRANSACTIONS);

  const { data: statsData, loading: statsLoading } = useQuery(
    GET_CATEGORY_STATISTICS
  );

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

  if (transactionsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const transactions = transactionsData?.transactions || [];
  const statistics = statsData?.categoryStatistics || [];

  const chartData = {
    labels: statistics.map(
      (stat) => stat.category.charAt(0).toUpperCase() + stat.category.slice(1)
    ),
    datasets: [
      {
        label: "Amount",
        data: statistics.map((stat) => stat.totalAmount),
        backgroundColor: [
          "rgba(34,197,94,0.8)",
          "rgba(236,72,153,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(249,115,22,0.8)",
          "rgba(168,85,247,0.8)",
          "rgba(234,179,8,0.8)",
          "rgba(239,68,68,0.8)",
        ],
        borderWidth: 2,
        borderRadius: 12,
        spacing: 6,
        cutout: "70%",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",

        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold",
          },
          boxWidth: 18,
          boxHeight: 18,
          padding: 5,
        },
      },
    },
  };

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
          {statistics.length > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Add transactions to see chart
            </div>
          )}
        </div>
        <TransactionForm />
      </div>

      {/* TRANSACTION CARDS */}
      <Cards transactions={transactions} />

      <TransactionSummary transactions={transactions} />
    </div>
  );
};

export default HomePage;
