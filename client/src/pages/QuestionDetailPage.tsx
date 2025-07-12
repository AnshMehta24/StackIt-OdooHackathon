import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Check,
  Share,
  Bookmark,
  Flag,
  Edit,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { sampleQuestions } from "@/data/sampleQuestions";
import { Link, useParams } from "react-router";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Find the question (in a real app, this would be fetched from an API)
  const question = sampleQuestions.find((q) => q.id === id);

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Question not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to questions
          </Link>
        </div>
      </div>
    );
  }

  // Sample answers (in a real app, these would be fetched from an API)
  const answers = [
    {
      id: "1",
      content:
        "For authentication in React with TypeScript, I recommend using a combination of React Context and a custom hook. Here's a robust approach:\n\n1. Create an AuthContext with TypeScript interfaces\n2. Use JWT tokens stored in httpOnly cookies for security\n3. Implement a custom useAuth hook for easy access\n4. Create a PrivateRoute component for protected routes\n\nThis approach provides type safety, security, and a clean API for your components.",
      votes: 15,
      isAccepted: true,
      author: {
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        reputation: 4520,
      },
      createdAt: "2024-01-15T11:45:00Z",
    },
    {
      id: "2",
      content:
        "Another excellent option is to use a library like Clerk or Auth0. These services handle the complexity of authentication while providing excellent TypeScript support and React hooks.\n\nPros:\n- Production-ready security\n- Social login options\n- User management UI\n- Excellent documentation\n\nFor learning purposes, implementing your own is great, but for production apps, consider these services.",
      votes: 8,
      isAccepted: false,
      author: {
        name: "Michael Chen",
        avatar: "/avatars/michael.jpg",
        reputation: 2890,
      },
      createdAt: "2024-01-15T13:20:00Z",
    },
  ];

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmittingAnswer(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Answer submitted:", newAnswer);
      setNewAnswer("");
      setIsSubmittingAnswer(false);
    }, 1000);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Question */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex space-x-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-3 min-w-[80px]">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 p-0 hover:bg-vote-up/10"
                  >
                    <ChevronUp className="h-8 w-8 text-vote-neutral hover:text-vote-up" />
                  </Button>
                  <span
                    className={`text-2xl font-bold ${
                      question.votes > 0
                        ? "text-success"
                        : question.votes < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {question.votes}
                  </span>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 p-0 hover:bg-vote-down/10"
                  >
                    <ChevronDown className="h-8 w-8 text-vote-neutral hover:text-vote-down" />
                  </Button>
                  <Button variant="ghost" size="lg" className="h-12 w-12 p-0">
                    <Bookmark className="h-6 w-6 text-muted-foreground hover:text-warning" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-4">{question.title}</h1>

                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {question.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {question.tags.map((tag, index) => (
                      <Link key={index} to={`/tags/${tag}`}>
                        <Badge
                          variant="secondary"
                          className="bg-tag-bg text-tag-text border-tag-border hover:bg-primary-light hover:text-primary"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>

                  {/* Actions and Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Flag
                      </Button>
                    </div>

                    <Link
                      to={`/users/${question.author.name}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          asked {formatTimeAgo(question.createdAt)}
                        </div>
                        <div className="font-medium">
                          {question.author.name}
                        </div>
                        <div className="text-sm text-primary">
                          {question.author.reputation.toLocaleString()}
                        </div>
                      </div>
                      <Avatar>
                        <AvatarImage src={question.author.avatar} />
                        <AvatarFallback>
                          {question.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>

            <div className="space-y-6">
              {answers.map((answer) => (
                <Card
                  key={answer.id}
                  className={`${
                    answer.isAccepted
                      ? "border-success bg-success-light/30"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <div className="flex flex-col items-center space-y-3 min-w-[80px]">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 w-12 p-0 hover:bg-vote-up/10"
                        >
                          <ChevronUp className="h-8 w-8 text-vote-neutral hover:text-vote-up" />
                        </Button>
                        <span
                          className={`text-2xl font-bold ${
                            answer.votes > 0
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        >
                          {answer.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 w-12 p-0 hover:bg-vote-down/10"
                        >
                          <ChevronDown className="h-8 w-8 text-vote-neutral hover:text-vote-down" />
                        </Button>
                        {answer.isAccepted && (
                          <div className="flex items-center justify-center h-12 w-12 bg-success rounded-full">
                            <Check className="h-6 w-6 text-success-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none mb-6">
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                            {answer.content}
                          </p>
                        </div>

                        {/* Actions and Author */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Flag
                            </Button>
                          </div>

                          <Link
                            to={`/users/${answer.author.name}`}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">
                                answered {formatTimeAgo(answer.createdAt)}
                              </div>
                              <div className="font-medium">
                                {answer.author.name}
                              </div>
                              <div className="text-sm text-primary">
                                {answer.author.reputation.toLocaleString()}
                              </div>
                            </div>
                            <Avatar>
                              <AvatarImage src={answer.author.avatar} />
                              <AvatarFallback>
                                {answer.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Answer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="min-h-[150px] mb-4"
                  required
                />
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={!newAnswer.trim() || isSubmittingAnswer}
                  >
                    {isSubmittingAnswer ? "Posting..." : "Post Your Answer"}
                  </Button>
                  <Button type="button" variant="outline">
                    Preview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
