import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, MessageSquare, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  votes: number;
  answers: number;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  createdAt: string;
  hasAcceptedAnswer?: boolean;
}

const QuestionCard = ({ 
  id, 
  title, 
  content, 
  votes, 
  answers, 
  tags, 
  author, 
  createdAt,
  hasAcceptedAnswer = false
}: QuestionCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="hover:shadow-hover transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2 min-w-[60px]">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-vote-up/10">
              <ChevronUp className="h-5 w-5 text-vote-neutral hover:text-vote-up" />
            </Button>
            <span className={`text-lg font-semibold ${votes > 0 ? 'text-success' : votes < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {votes}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-vote-down/10">
              <ChevronDown className="h-5 w-5 text-vote-neutral hover:text-vote-down" />
            </Button>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col items-center justify-center space-y-2 min-w-[80px]">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm ${
              hasAcceptedAnswer 
                ? 'bg-success text-success-foreground' 
                : answers > 0 
                  ? 'bg-primary-light text-primary' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">{answers}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {answers === 1 ? 'answer' : 'answers'}
            </span>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link 
              to={`/questions/${id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {title}
              </h3>
            </Link>
            
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <Link key={index} to={`/tags/${tag}`}>
                  <Badge 
                    variant="secondary" 
                    className="bg-tag-bg text-tag-text border-tag-border hover:bg-primary-light hover:text-primary transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Author and Timestamp */}
            <div className="flex items-center justify-between">
              <Link 
                to={`/users/${author.name}`}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback className="text-xs">
                    {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="font-medium text-foreground">{author.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-primary font-medium">{author.reputation.toLocaleString()}</span>
                </div>
              </Link>
              
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;