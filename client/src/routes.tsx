import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import AskQuestionPage from "./pages/AskQuestionPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./layout/ProtectedRoute";import UserProfilePage from "./pages/UserProfilePage";
import AnswersPage from "./pages/AnswersPage";
import YourQustions from "./pages/YourQuestions";


const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/ask" element={<AskQuestionPage />} />
      </Route>
      <Route path="/questions/:id" element={<QuestionDetailPage />} />
      {/* <Route path="/tags" element={<TagsPage />} /> */}
      <Route path="/users/:username" element={<UserProfilePage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/answers" element={<AnswersPage />} />
      <Route path="/questions" element={<YourQustions />} />
    </Routes>
  );
};

export default routes;
