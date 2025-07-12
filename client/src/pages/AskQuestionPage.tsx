import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Eye, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popularTags = [
    "react", "typescript", "javascript", "node.js", "next.js", 
    "tailwind-css", "python", "css", "html", "git"
  ];

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(currentTag);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || tags.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Question submitted:", { title, content, tags });
      navigate("/");
    }, 1000);
  };

  const previewContent = content || "Your question will appear here as you type...";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
            <p className="text-muted-foreground">
              Get help from the community by asking a clear, detailed question
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <Card>
                  <CardHeader>
                    <CardTitle>Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="title" className="text-sm text-muted-foreground mb-2 block">
                      Be specific and imagine you're asking a question to another person
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How to implement authentication in React with TypeScript?"
                      className="text-lg"
                      required
                    />
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="write" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="write" className="flex items-center space-x-2">
                          <Edit3 className="h-4 w-4" />
                          <span>Write</span>
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="write">
                        <Label htmlFor="content" className="text-sm text-muted-foreground mb-2 block">
                          Include all the information someone would need to answer your question
                        </Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Provide details about your problem, what you've tried, and what you expect to happen..."
                          className="min-h-[200px] resize-none"
                          required
                        />
                      </TabsContent>
                      
                      <TabsContent value="preview">
                        <div className="min-h-[200px] p-4 border rounded-md bg-muted/30">
                          <p className="whitespace-pre-wrap text-sm">
                            {previewContent}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Add up to 5 tags to describe what your question is about
                    </Label>
                    
                    <div className="space-y-4">
                      {/* Tag Input */}
                      <div className="flex space-x-2">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Type a tag and press Enter"
                          className="flex-1"
                          disabled={tags.length >= 5}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddTag(currentTag)}
                          disabled={!currentTag.trim() || tags.length >= 5}
                          size="icon"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Selected Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-tag-bg text-tag-text border-tag-border px-3 py-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Popular Tags */}
                      <div>
                        <p className="text-sm font-medium mb-2">Popular tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {popularTags
                            .filter(tag => !tags.includes(tag))
                            .slice(0, 8)
                            .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTag(tag)}
                              disabled={tags.length >= 5}
                              className="text-xs"
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={!title.trim() || !content.trim() || tags.length === 0 || isSubmitting}
                    className="px-8"
                  >
                    {isSubmitting ? "Posting..." : "Post Question"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar Tips */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to ask a good question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">1. Write a clear title</h4>
                    <p className="text-muted-foreground">
                      Summarize your problem in a one-line title
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">2. Describe your problem</h4>
                    <p className="text-muted-foreground">
                      Explain what you're trying to do and what happened instead
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">3. Show what you tried</h4>
                    <p className="text-muted-foreground">
                      Include code, error messages, and research efforts
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">4. Add relevant tags</h4>
                    <p className="text-muted-foreground">
                      Help others find your question by adding relevant tags
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Be respectful and courteous</p>
                  <p>• Search before asking</p>
                  <p>• Write in clear, grammatical language</p>
                  <p>• Include relevant code and error messages</p>
                  <p>• Accept helpful answers to close the question</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;