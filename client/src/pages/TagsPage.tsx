import { useState } from "react";
import { Search, Tag, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

interface TagData {
  name: string;
  description: string;
  questionCount: number;
  todayCount: number;
  weekCount: number;
}

const TagsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const tags: TagData[] = [
    {
      name: "react",
      description: "A JavaScript library for building user interfaces",
      questionCount: 1234,
      todayCount: 15,
      weekCount: 89,
    },
    {
      name: "typescript",
      description: "TypeScript extends JavaScript by adding types",
      questionCount: 987,
      todayCount: 12,
      weekCount: 67,
    },
    {
      name: "javascript",
      description: "High-level, interpreted programming language",
      questionCount: 2341,
      todayCount: 25,
      weekCount: 156,
    },
    {
      name: "next.js",
      description: "React framework for production applications",
      questionCount: 543,
      todayCount: 8,
      weekCount: 45,
    },
    {
      name: "tailwind-css",
      description: "Utility-first CSS framework",
      questionCount: 321,
      todayCount: 6,
      weekCount: 34,
    },
    {
      name: "node.js",
      description: "JavaScript runtime built on Chrome's V8 engine",
      questionCount: 876,
      todayCount: 11,
      weekCount: 58,
    },
    {
      name: "python",
      description: "High-level programming language",
      questionCount: 1567,
      todayCount: 18,
      weekCount: 92,
    },
    {
      name: "css",
      description: "Style sheet language for styling web pages",
      questionCount: 1890,
      todayCount: 22,
      weekCount: 134,
    },
  ];

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tags</h1>
            <p className="text-muted-foreground mb-6">
              A tag is a keyword or label that categorizes your question with
              other, similar questions.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter by tag name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <Link key={tag.name} to={`/questions/tagged/${tag.name}`}>
                <Card className="h-full hover:shadow-hover transition-all duration-200 hover:border-primary/50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-tag-bg rounded-lg">
                        <Tag className="h-5 w-5 text-tag-text" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary hover:text-primary-hover transition-colors">
                          {tag.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {tag.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Questions:
                        </span>
                        <span className="font-medium">
                          {tag.questionCount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Today:</span>
                        <Badge
                          variant="secondary"
                          className="bg-secondary-light text-secondary"
                        >
                          +{tag.todayCount}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          This week:
                        </span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-success" />
                          <span className="text-success font-medium">
                            +{tag.weekCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredTags.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tags found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all available tags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
