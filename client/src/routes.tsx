import { Route, Routes } from "react-router";
import Home from "./pages/Home";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default routes;
