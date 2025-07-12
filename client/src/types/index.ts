export type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ErrorResponse<T> = {
  success: false;
  errors: {
    message: string;
    data: T | null;
  };
};

export type Question = {
  id: string;
  title: string;
  tags: string[];
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Author = {
  name: string;
  email: string;
};

export type QuestionWithAuthor = {
  question: Question;
  author: Author;
};

export type FullQuestionResponse = {
  question: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  author: {
    name: string;
    email: string;
  };
  answers: {
    answer: {
      id: string;
      content: string;
      questionId: string | null;
      userId: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
    };
    author: {
      name: string;
      email: string;
    };
  }[];
  voteStats: {
    upvotes: number;
    downvotes: number;
  };
};
