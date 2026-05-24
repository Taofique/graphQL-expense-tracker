const TransactionFormSkeleton = () => {
  return (
    <div className="h-screen max-w-lg mx-auto flex flex-col gap-5 py-10 px-4">
      {/* TITLE */}
      <div className="h-8 w-2/3 bg-gray-300 rounded animate-pulse" />

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
      </div>

      {/* TYPE */}
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
      </div>

      {/* PAYMENT + CATEGORY */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
        </div>
      </div>

      {/* AMOUNT */}
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
      </div>

      {/* LOCATION */}
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
      </div>

      {/* DATE */}
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
      </div>

      {/* BUTTON */}
      <div className="h-12 w-full bg-pink-300 rounded animate-pulse" />
    </div>
  );
};

export default TransactionFormSkeleton;
