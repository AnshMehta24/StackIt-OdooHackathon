export interface Question {
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

export const sampleQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement authentication in React with TypeScript?",
    content: "I'm building a React application with TypeScript and need to implement user authentication. What are the best practices for handling login, logout, and protecting routes? Should I use Context API or a state management library like Zustand?",
    votes: 24,
    answers: 8,
    tags: ["react", "typescript", "authentication", "context-api"],
    author: {
      name: "Alex Chen",
      avatar: "/avatars/alex.jpg", 
      reputation: 2340
    },
    createdAt: "2024-01-15T10:30:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "2", 
    title: "Best practices for TypeScript error handling in async functions",
    content: "I'm working on a Node.js application and struggling with proper error handling patterns in TypeScript. How should I handle errors in async/await functions? What's the difference between throwing errors and returning error objects?",
    votes: 18,
    answers: 5,
    tags: ["typescript", "node.js", "error-handling", "async-await"],
    author: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      reputation: 1890
    },
    createdAt: "2024-01-15T08:45:00Z",
    hasAcceptedAnswer: false
  },
  {
    id: "3",
    title: "Next.js 14 Server Components vs Client Components - When to use which?",
    content: "I'm confused about the new Server Components in Next.js 14. When should I use Server Components vs Client Components? What are the performance implications, and how do they affect state management and user interactions?",
    votes: 35,
    answers: 12,
    tags: ["next.js", "react", "server-components", "performance"],
    author: {
      name: "Michael Rodriguez",
      avatar: "/avatars/michael.jpg",
      reputation: 3520
    },
    createdAt: "2024-01-14T16:20:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "4",
    title: "Tailwind CSS: Custom utility classes vs component-based approach",
    content: "I'm debating between creating custom utility classes in Tailwind CSS versus using a component-based approach for reusable styles. What are the pros and cons of each approach? How do you maintain consistency across a large codebase?",
    votes: 12,
    answers: 0,
    tags: ["tailwind-css", "css", "design-system", "components"],
    author: {
      name: "Emily Davis",
      avatar: "/avatars/emily.jpg",
      reputation: 987
    },
    createdAt: "2024-01-14T14:15:00Z",
    hasAcceptedAnswer: false
  },
  {
    id: "5",
    title: "React Query vs SWR vs Zustand for state management - Which one to choose?",
    content: "I'm starting a new React project and need to choose a state management solution. I've heard good things about React Query for server state, SWR for data fetching, and Zustand for client state. What are the key differences and when should I use each?",
    votes: 28,
    answers: 15,
    tags: ["react", "state-management", "react-query", "swr", "zustand"],
    author: {
      name: "David Kim",
      avatar: "/avatars/david.jpg",
      reputation: 4230
    },
    createdAt: "2024-01-14T11:30:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "6",
    title: "How to optimize React application performance for large datasets?",
    content: "I have a React application that renders large lists with thousands of items. The app becomes slow and unresponsive. What are the best techniques for optimizing performance? Should I use virtualization, pagination, or something else?",
    votes: 42,
    answers: 9,
    tags: ["react", "performance", "optimization", "virtualization"],
    author: {
      name: "Jennifer Lee",
      avatar: "/avatars/jennifer.jpg",
      reputation: 2780
    },
    createdAt: "2024-01-13T20:45:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "7",
    title: "Understanding Vite build process and configuration",
    content: "I'm migrating from Create React App to Vite and want to understand the build process better. How does Vite's HMR work? What are the key configuration options I should know about for a production build?",
    votes: 15,
    answers: 3,
    tags: ["vite", "build-tools", "react", "configuration"],
    author: {
      name: "Thomas Wilson",
      avatar: "/avatars/thomas.jpg",
      reputation: 1456
    },
    createdAt: "2024-01-13T15:20:00Z",
    hasAcceptedAnswer: false
  },
  {
    id: "8",
    title: "GraphQL vs REST API: Which approach for a new project?",
    content: "I'm designing the API for a new web application and considering GraphQL vs REST. What are the main advantages and disadvantages of each approach? When does GraphQL make more sense than REST?",
    votes: 33,
    answers: 11,
    tags: ["graphql", "rest-api", "api-design", "backend"],
    author: {
      name: "Lisa Chang",
      avatar: "/avatars/lisa.jpg",
      reputation: 3890
    },
    createdAt: "2024-01-13T09:10:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "9",
    title: "Docker containerization for Node.js applications - Best practices",
    content: "I want to containerize my Node.js application with Docker for production deployment. What are the security considerations, performance optimizations, and best practices for creating efficient Docker images?",
    votes: 21,
    answers: 6,
    tags: ["docker", "node.js", "containerization", "deployment"],
    author: {
      name: "Roberto Garcia",
      avatar: "/avatars/roberto.jpg",
      reputation: 2190
    },
    createdAt: "2024-01-12T18:30:00Z",
    hasAcceptedAnswer: false
  },
  {
    id: "10",
    title: "Testing strategies for React components with Jest and React Testing Library",
    content: "I'm setting up comprehensive testing for my React application. What are the best practices for testing components with React Testing Library? How do I test user interactions, async operations, and custom hooks effectively?",
    votes: 38,
    answers: 14,
    tags: ["testing", "react", "jest", "react-testing-library"],
    author: {
      name: "Amanda Foster",
      avatar: "/avatars/amanda.jpg",
      reputation: 3140
    },
    createdAt: "2024-01-12T13:45:00Z",
    hasAcceptedAnswer: true
  }
];
