import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import QuestionCard from "@/components/questions/QuestionCard";
import TrendingSidebar from "@/components/sidebar/TrendingSidebar";
import { sampleQuestions } from "@/data/sampleQuestions";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";

const YourQustions = () => {
  const [activeFilter, setActiveFilter] = useState("recent");
  const [questions] = useState(sampleQuestions);

  // Filter for questions with answers
  const questionsWithAnswers = questions.filter(q => q.answers > 0);

  const getSortedQuestions = () => {
    switch (activeFilter) {
      case "most-answers":
        return [...questionsWithAnswers].sort((a, b) => b.answers - a.answers);
      case "accepted":
        return questionsWithAnswers.filter(q => q.hasAcceptedAnswer);
      case "votes":
        return [...questionsWithAnswers].sort((a, b) => b.votes - a.votes);
      default: // recent
        return [...questionsWithAnswers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const sortedQuestions = getSortedQuestions();

  const filters = [
    { id: "recent", label: "Recent Answers", description: "Recently answered questions" },
    { id: "most-answers", label: "Most Answers", description: "Questions with most responses" },
    { id: "accepted", label: "Accepted", description: "Questions with accepted answers" },
    { id: "votes", label: "Top Voted", description: "Highest voted answers" },
  ];

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
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  Your Questions
                </h1>
                <p className="text-muted-foreground">
                  {sortedQuestions.length.toLocaleString()}Questions
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

            {/* Answer Filters */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`whitespace-nowrap transition-all ${
                    activeFilter === filter.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

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
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold mb-2">No answered questions found</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeFilter === "accepted" 
                      ? "No questions have accepted answers yet." 
                      : "No questions have been answered in this category yet."}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <Link to="/questions">Browse Questions</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/ask">Ask a Question</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Load More */}
            {sortedQuestions.length > 0 && (
              <div className="text-center py-8">
                <Button variant="outline">Load More Answers</Button>
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

export default YourQustions;