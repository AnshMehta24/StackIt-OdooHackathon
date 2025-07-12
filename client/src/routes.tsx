import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default routes;
