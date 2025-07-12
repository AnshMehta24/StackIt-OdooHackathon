import { useState } from "react";
import Header from "@/components/layout/Header";
import QuestionCard from "@/components/questions/QuestionCard";
import QuestionFilters from "@/components/questions/QuestionFilters";
import TrendingSidebar from "@/components/sidebar/TrendingSidebar";
import { sampleQuestions } from "@/data/sampleQuestions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const QuestionsPage = () => {
  const [activeFilter, setActiveFilter] = useState("newest");
  const [questions] = useState(sampleQuestions);

  const getSortedQuestions = () => {
    switch (activeFilter) {
      case "votes":
        return [...questions].sort((a, b) => b.votes - a.votes);
      case "unanswered":
        return questions.filter(q => q.answers === 0);
      case "trending":
        return [...questions].sort((a, b) => b.votes + b.answers - (a.votes + a.answers));
      default: // newest
        return [...questions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const sortedQuestions = getSortedQuestions();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">All Questions</h1>
                <p className="text-muted-foreground">
                  {sortedQuestions.length.toLocaleString()} questions
                </p>
              </div>
              
              {/* Mobile Ask Button */}
              <Button asChild className="lg:hidden">
                <Link to="/ask">
                  <Plus className="h-4 w-4 mr-2" />
                  Ask Question
                </Link>
              </Button>
            </div>

            {/* Filters */}
            <QuestionFilters 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Questions List */}
            <div className="space-y-4">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    id={question.id}
                    title={question.title}
                    content={question.content}
                    votes={question.votes}
                    answers={question.answers}
                    tags={question.tags}
                    author={question.author}
                    createdAt={question.createdAt}
                    hasAcceptedAnswer={question.hasAcceptedAnswer}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeFilter === "unanswered" 
                      ? "All questions have been answered! Great job community." 
                      : "Be the first to ask a question in this category."}
                  </p>
                  <Button asChild>
                    <Link to="/ask">Ask the First Question</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Load More */}
            {sortedQuestions.length > 0 && (
              <div className="text-center py-8">
                <Button variant="outline">Load More Questions</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;