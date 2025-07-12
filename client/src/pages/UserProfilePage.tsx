import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Link as LinkIcon, Award, TrendingUp, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data (in a real app, this would be fetched from an API)
  const userData = {
    name: "Alex Chen",
    username: "alex-chen",
    avatar: "/avatars/alex.jpg",
    reputation: 2340,
    joinDate: "2023-03-15",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    bio: "Full-stack developer passionate about React, TypeScript, and building great user experiences.",
    stats: {
      questionsAsked: 15,
      answersGiven: 42,
      acceptedAnswers: 28,
      totalVotes: 156
    },
    badges: [
      { name: "Good Question", count: 5, type: "bronze" },
      { name: "Nice Answer", count: 12, type: "bronze" },
      { name: "Popular Question", count: 2, type: "silver" },
      { name: "Great Answer", count: 1, type: "gold" }
    ]
  };

  const recentQuestions = [
    {
      id: "1",
      title: "How to implement authentication in React with TypeScript?",
      votes: 24,
      answers: 8,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      title: "Best practices for state management in large React apps",
      votes: 18,
      answers: 5,
      createdAt: "2024-01-12T14:20:00Z"
    }
  ];

  const recentAnswers = [
    {
      id: "1",
      questionTitle: "How to optimize React performance?",
      votes: 15,
      isAccepted: true,
      createdAt: "2024-01-14T09:15:00Z"
    },
    {
      id: "2",
      questionTitle: "TypeScript generic constraints explained",
      votes: 12,
      isAccepted: false,
      createdAt: "2024-01-13T16:45:00Z"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="text-2xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                    <p className="text-muted-foreground mb-4">@{userData.username}</p>
                    
                    <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {formatDate(userData.joinDate)}</span>
                      </div>
                      {userData.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{userData.location}</span>
                        </div>
                      )}
                    </div>

                    {userData.website && (
                      <div className="flex items-center justify-center md:justify-start space-x-1 text-sm text-primary hover:text-primary-hover mb-4">
                        <LinkIcon className="h-4 w-4" />
                        <a href={userData.website} target="_blank" rel="noopener noreferrer">
                          {userData.website}
                        </a>
                      </div>
                    )}

                    {userData.bio && (
                      <p className="text-muted-foreground max-w-md">{userData.bio}</p>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-primary-light p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{userData.reputation.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Reputation</div>
                    </div>
                    <div className="bg-secondary-light p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary">{userData.stats.questionsAsked}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="bg-success-light p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-success">{userData.stats.answersGiven}</div>
                      <div className="text-sm text-muted-foreground">Answers</div>
                    </div>
                    <div className="bg-warning-light p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-warning">{userData.stats.acceptedAnswers}</div>
                      <div className="text-sm text-muted-foreground">Accepted</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Badges</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.badges.map((badge, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className={`${getBadgeColor(badge.type)} border`}
                        >
                          {badge.name} ×{badge.count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions ({userData.stats.questionsAsked})</TabsTrigger>
              <TabsTrigger value="answers">Answers ({userData.stats.answersGiven})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Recent Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentQuestions.map((question) => (
                      <div key={question.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-primary hover:text-primary-hover line-clamp-2 mb-2">
                          {question.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>{question.votes} votes</span>
                            <span>{question.answers} answers</span>
                          </div>
                          <span>{formatDate(question.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Answers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Recent Answers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentAnswers.map((answer) => (
                      <div key={answer.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-primary hover:text-primary-hover line-clamp-2 flex-1">
                            {answer.questionTitle}
                          </h4>
                          {answer.isAccepted && (
                            <Badge className="bg-success text-success-foreground ml-2">
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{answer.votes} votes</span>
                          <span>{formatDate(answer.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentQuestions.map((question) => (
                      <div key={question.id} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="text-lg font-medium text-primary hover:text-primary-hover mb-3">
                          {question.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-6">
                            <span className="font-medium">{question.votes} votes</span>
                            <span>{question.answers} answers</span>
                          </div>
                          <span>Asked {formatDate(question.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="answers" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentAnswers.map((answer) => (
                      <div key={answer.id} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-primary hover:text-primary-hover flex-1">
                            {answer.questionTitle}
                          </h3>
                          {answer.isAccepted && (
                            <Badge className="bg-success text-success-foreground ml-4">
                              Accepted Answer
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="font-medium">{answer.votes} votes</span>
                          <span>Answered {formatDate(answer.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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