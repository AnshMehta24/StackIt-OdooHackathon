import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import QuestionsPage from "./pages/QuestionsPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import TagsPage from "./pages/TagsPage";
import NotFound from "./pages/NotFound";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<QuestionsPage />} />
      <Route path="/ask" element={<AskQuestionPage />} />
      <Route path="/questions/:id" element={<QuestionDetailPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/tags/:tag" element={<QuestionsPage />} />
      {/* <Route path="/users/:username" element={<UserProfilePage />} /> */}
      {/* <Route path="/profile" element={<UserProfilePage />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default routes;
