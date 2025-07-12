/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  Share,
  Bookmark,
  Edit,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useParams } from "react-router";
import { useGetQuestionById } from "@/hooks/services/questions";
import { useUser } from "@/hooks/services/user";
import { Editor } from "@tinymce/tinymce-react";
import { useUploadFile } from "@/hooks/upload";
import { toast } from "sonner";
import { useCreateAnswer } from "@/hooks/services/answer";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetQuestionById(id ?? "");
  const { data: Users } = useUser();
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();

  const uploadFileMutation = useUploadFile();

  const answerMutation = useCreateAnswer();

  const handleSubmitAnswer = async () => {
    const content = editorRef.current?.getContent();
    if (!content || content.trim() === "" || !id) {
      toast.error("Wait for Editor to load. Or Refresh the window.");
      return;
    }
    await toast.promise(
      answerMutation.mutateAsync({
        content,
        questionId: id,
      }),
      {
        loading: "Adding answer...",
        success: () => {
          navigate("/");
          return "Answer Addedf successfully!";
        },
        error: (err) => {
          return err instanceof Error ? err.message : "Something went wrong";
        },
      }
    );
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

  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (error || !data)
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

  const { question, author, answers, voteStats } = data.data;

  const questionVotes = voteStats.upvotes - voteStats.downvotes;

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
                      questionVotes > 0
                        ? "text-success"
                        : questionVotes < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {questionVotes}
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
                    <div
                      dangerouslySetInnerHTML={{ __html: question.description }}
                      className="text-foreground leading-relaxed whitespace-pre-wrap"
                    ></div>
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
                      {question.userId === Users?.data.userId && (
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                    <Link
                      to={`/users/${author.name}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          asked {formatTimeAgo(question.createdAt  || "")}
                        </div>
                        <div className="font-medium">{author.name}</div>
                        <div className="text-sm text-primary">
                          {author.email}
                        </div>
                      </div>
                      <Avatar>
                        <AvatarImage src={""} />
                        <AvatarFallback>
                          {author.name
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

          {/* Answers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>
            <div className="space-y-6">
              {answers.map((answerData) => {
                const { answer, author: answerAuthor } = answerData;

                const answerVotes = 0;

                return (
                  <Card key={answer.id}>
                    <CardContent className="p-6">
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
                              answerVotes > 0
                                ? "text-success"
                                : "text-muted-foreground"
                            }`}
                          >
                            {answerVotes}
                          </span>
                          <Button
                            variant="ghost"
                            size="lg"
                            className="h-12 w-12 p-0 hover:bg-vote-down/10"
                          >
                            <ChevronDown className="h-8 w-8 text-vote-neutral hover:text-vote-down" />
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="prose prose-sm max-w-none mb-6">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: answer.content,
                              }}
                              className="text-foreground leading-relaxed whitespace-pre-wrap"
                            ></div>
                          </div>

                          {/* Actions and Author */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                              {question.userId === Users?.data.userId && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              )}
                            </div>
                            <Link
                              to={`/users/${answerAuthor.name}`}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">
                                  answered{" "}
                                  {formatTimeAgo(answer.createdAt || "")}
                                </div>
                                <div className="font-medium">
                                  {answerAuthor.name}
                                </div>
                                <div className="text-sm text-primary">
                                  {answerAuthor.email}
                                </div>
                              </div>
                              <Avatar>
                                <AvatarImage src={""} />
                                <AvatarFallback>
                                  {answerAuthor.name
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
                );
              })}
            </div>
          </div>

          {/* Add Answer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>

              <Editor
                onInit={(_, editor) => {
                  editorRef.current = editor;

                  editor.on("change", () => {
                    console.log("Content changed");
                  });
                }}
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                init={{
                  height: 300,
                  plugins: "image link lists code",
                  toolbar:
                    "undo redo | formatselect | bold italic | image | code",
                  images_upload_handler: async (
                    blobInfo: {
                      blob: () => Blob;
                      filename: () => string | undefined;
                    },

                    success: (arg0: any) => void,
                    failure: (arg0: string) => void
                  ) => {
                    try {
                      const formData = new FormData();
                      formData.append(
                        "file",
                        blobInfo.blob(),
                        blobInfo.filename()
                      );

                      const res = await uploadFileMutation.mutateAsync(
                        formData
                      );

                      const { data } = res;
                      console.log(data);
                      success(data.filePath);
                    } catch (err) {
                      console.error(err);
                      failure("Upload failed");
                    }
                  },
                }}
              />

              <div className="flex space-x-4 mt-10">
                <Button type="submit" onClick={handleSubmitAnswer}>
                  {"Post Your Answer"}
                </Button>
                <Button
                  className="text-foreground"
                  type="button"
                  variant="outline"
                >
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
