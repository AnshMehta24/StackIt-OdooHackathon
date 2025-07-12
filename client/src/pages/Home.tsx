import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import QuestionCard from "@/components/questions/QuestionCard";
import QuestionFilters from "@/components/questions/QuestionFilters";
import TrendingSidebar from "@/components/sidebar/TrendingSidebar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Tag, Hash } from "lucide-react";
import { Link } from "react-router";
import { useGetQuestions } from "@/hooks/services/questions";

const Home: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const {
    data: questions = [],
    isLoading,
    isError,
  } = useGetQuestions(selectedTag);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const clearTagSelection = () => {
    setSelectedTag(null);
  };

  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach((item) => {
      if (item.question.tags && Array.isArray(item.question.tags)) {
        item.question.tags.forEach((tag) => {
          if (tag && typeof tag === "string") {
            tagSet.add(tag.toLowerCase().trim());
          }
        });
      }
    });
    return Array.from(tagSet).sort();
  }, [questions]);

  const getSortedQuestions = () => {
    switch (activeFilter) {
      case "unanswered":
        return questions;
      case "trending":
        return [...questions].sort(
          (a, b) =>
            new Date(b.question.updatedAt).getTime() -
            new Date(a.question.updatedAt).getTime()
        );
      default: // newest
        return [...questions].sort(
          (a, b) =>
            new Date(b.question.createdAt).getTime() -
            new Date(a.question.createdAt).getTime()
        );
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedTag
                    ? `Questions tagged with "${selectedTag}"`
                    : "All Questions"}
                </h1>
                <p className="text-muted-foreground">
                  {sortedQuestions.length.toLocaleString()} questions
                  {selectedTag && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearTagSelection}
                      className="ml-2 h-auto p-1 text-blue-600 hover:text-blue-800"
                    >
                      Clear filter
                    </Button>
                  )}
                </p>
              </div>
              <Button asChild className="lg:hidden">
                <Link to="/ask">
                  <Plus className="h-4 w-4 mr-2" />
                  Ask Question
                </Link>
              </Button>
            </div>

            {/* Top Level Tags Display */}
            {!selectedTag && uniqueTags.length > 0 && (
              <div className="mb-6 p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Popular Tags</h2>
                  <span className="text-sm text-muted-foreground">
                    ({uniqueTags.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.slice(0, 10).map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {String(tag)}
                    </span>
                  ))}
                  {uniqueTags.length > 10 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{uniqueTags.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <QuestionFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="text-center py-20 text-red-500 font-medium">
                Failed to load questions.
              </div>
            ) : (
              <div className="space-y-4">
                {sortedQuestions.length > 0 ? (
                  sortedQuestions.map((item) => (
                    <QuestionCard
                      key={item.question.id}
                      id={item.question.id}
                      title={item.question.title}
                      content={item.question.description}
                      tags={item.question.tags}
                      author={item.author}
                      createdAt={item.question.createdAt}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤔</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No questions found
                    </h3>
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
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="space-y-6">
              {/* Tags Sidebar */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">All Tags</h3>
                  <span className="text-sm text-muted-foreground">
                    ({uniqueTags.length})
                  </span>
                </div>
                {uniqueTags.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uniqueTags.map((tag, i) => (
                      <div
                        key={i}
                        onClick={() => handleTagClick(tag)}
                        className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          {String(tag)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {
                            questions.filter((q) =>
                              q.question.tags?.some(
                                (t) => t?.toLowerCase() === tag
                              )
                            ).length
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags found</p>
                )}
              </div>

              {/* Trending Sidebar */}
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
