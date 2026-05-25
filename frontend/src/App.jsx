import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ← was missing
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import TransactionPage from "./pages/TransactionPage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

function App() {
  const { loading, data, error, refetch } = useQuery(GET_AUTHENTICATED_USER, {
    fetchPolicy: "network-only",
  });

  const authUser = data?.authUser;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
  }

  return (
    <>
      <Toaster position="top-center" />
      {authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage onLogout={refetch} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authUser ? <LoginPage onLogin={refetch} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? <SignUpPage onSignup={refetch} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/transaction/:id"
          element={authUser ? <TransactionPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
