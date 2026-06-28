import { FaLocationDot, FaTrash, FaSackDollar } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import { DELETE_TRANSACTION } from "../../graphql/mutations/transaction.mutation";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

const Card = ({ transaction }) => {
  const { _id, description, paymentType, category, amount, location, date } =
    transaction;

  const cardClass =
    categoryColorMap[category?.toLowerCase()] || "from-gray-700 to-gray-500";

  const [deleteTransaction, { loading: deleteLoading }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetCategoryStatistics"],

      onCompleted: () => {
        toast.success("Transaction deleted successfully!");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleDelete = async () => {
    await deleteTransaction({
      variables: {
        id: _id,
      },
    });
  };

  return (
    <div className={`rounded-xl p-4 shadow-lg bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white capitalize">
            {category}
          </h2>

          <div className="flex items-center gap-3 text-white">
            <FaTrash
              onClick={handleDelete}
              className={`cursor-pointer hover:scale-110 transition ${
                deleteLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            />

            <Link to={`/transaction/${_id}`}>
              <HiPencilAlt
                className="cursor-pointer hover:scale-110 transition"
                size={20}
              />
            </Link>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-white flex items-center gap-2">
          <BsCardText />
          <span>{description}</span>
        </p>

        {/* PAYMENT TYPE */}
        <p className="text-white flex items-center gap-2">
          <MdOutlinePayments />
          <span className="capitalize">{paymentType}</span>
        </p>

        {/* AMOUNT */}
        <p className="text-white flex items-center gap-2">
          <FaSackDollar />
          <span>${amount}</span>
        </p>

        {/* LOCATION */}
        <p className="text-white flex items-center gap-2">
          <FaLocationDot />
          <span>{location || "Unknown"}</span>
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-white font-semibold">
            {new Date(date).toLocaleDateString()}
          </p>

          <img
            src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
            className="h-8 w-8 border rounded-full"
            alt="avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
