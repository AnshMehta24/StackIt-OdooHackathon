import {  Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router";

interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const QuestionCard = ({
  id,
  title,
  content,
  tags,
  author,
  createdAt,
}: QuestionCardProps) => {
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
    <Card className="hover:shadow-hover transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link to={`/questions/${id}`} className="block group">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {title}
              </h3>
            </Link>

            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="text-muted-foreground text-sm line-clamdiv-3 mb-4"
            ></div>

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
                  <AvatarFallback className="text-xs">
                    {author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="font-medium text-foreground">
                    {author.name}
                  </span>
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
