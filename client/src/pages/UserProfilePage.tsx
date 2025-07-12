/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAnsweredQuestions,
  useUser,
  useUserQuestions,
} from "@/hooks/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useUser();
  const { data: userQuestions = [], isLoading: isLoadingUserQuestions } =
    useUserQuestions();
  const { data: answeredQuestions = [], isLoading: isLoadingAnswered } =
    useAnsweredQuestions();

  useEffect(() => {
    if (isError) {
      navigate("/auth");
    }
  }, [isError, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/default-avatar.png" />
                  <AvatarFallback className="text-xl">
                    {user?.data.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user?.data.name}</h1>
                  <p className="text-muted-foreground mb-1">
                    @{user?.data.username}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {user?.data.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {isLoadingUserQuestions ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : userQuestions.length === 0 ? (
                    <p className="text-muted-foreground">
                      No questions asked yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {userQuestions.map((question: any) => (
                        <div
                          key={question.id}
                          className="p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-primary hover:text-primary-hover mb-3">
                            {question.title}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Asked on {formatDate(question.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="answers" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {isLoadingAnswered ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : answeredQuestions.length === 0 ? (
                    <p className="text-muted-foreground">
                      No answers given yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {answeredQuestions.map((answer: any) => (
                        <div
                          key={answer.id}
                          className="p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-primary hover:text-primary-hover mb-3">
                            {answer.title}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Answered on {formatDate(answer.answeredAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
