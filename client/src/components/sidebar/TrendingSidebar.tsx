import { Users, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const TrendingSidebar = () => {
  const featuredQuestions = [
    {
      id: "1",
      title: "How to optimize React performance in large applications?",
      votes: 45,
      answers: 8,
    },
    {
      id: "2",
      title: "Best practices for TypeScript error handling",
      votes: 32,
      answers: 5,
    },
    {
      id: "3",
      title: "Understanding Next.js 14 Server Components",
      votes: 28,
      answers: 12,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Ask Question CTA */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-lg font-semibold mb-2">Have a Question?</h3>
            <p className="text-sm opacity-90 mb-4">
              Get answers from the community
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/ask">Ask Question</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Questions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            <span>Hot Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredQuestions.map((question) => (
            <Link
              key={question.id}
              to={`/questions/${question.id}`}
              className="block group"
            >
              <div className="p-3 rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {question.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <span>{question.votes} votes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>{question.answers} answers</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">15.2K</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">32.8K</div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">8.9K</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">156</div>
                <div className="text-sm text-muted-foreground">Online</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSidebar;
