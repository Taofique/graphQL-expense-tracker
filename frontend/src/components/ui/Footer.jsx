import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-50 mt-20 pb-6 text-white">
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Gradient Line */}
        <div className="relative mb-8">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 px-6 text-center">
          <h2 className="text-xl font-semibold tracking-wide">
            Expense{" "}
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent"
            >
              GQL
            </Link>
          </h2>

          <p className="text-sm text-gray-400">
            Track your expenses beautifully with GraphQL
          </p>

          <p className="text-xs text-gray-500 mt-2">
            © 2026 ExpenseGQL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
