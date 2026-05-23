import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import TransactionPage from "./pages/TransactionPage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

function App() {
  const authUser = false;

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/transaction/:id" element={<TransactionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
