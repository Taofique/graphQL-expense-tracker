import Card from "./Card";

const Cards = ({ transactions }) => {
  if (!transactions?.length) {
    return (
      <div className="w-full py-10 text-center text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 min-h-[40vh]">
      <p className="text-4xl md:text-5xl font-bold text-center my-10">
        History
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {transactions.map((transaction) => (
          <Card key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
