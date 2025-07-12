import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import QuestionsPage from "./pages/QuestionsPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import TagsPage from "./pages/TagsPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./layout/ProtectedRoute";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/ask" element={<AskQuestionPage />} />
      </Route>
      <Route path="/questions/:id" element={<QuestionDetailPage />} />
      {/* <Route path="/tags" element={<TagsPage />} /> */}
      {/* <Route path="/users/:username" element={<UserProfilePage />} /> */}
      {/* <Route path="/profile" element={<UserProfilePage />} /> */}
      <Route path="*" element={<NotFound />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default routes;
