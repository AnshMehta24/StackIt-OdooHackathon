import { userService } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: userService.getUser,
  });
}

export function useUserQuestions() {
  return useQuery({
    queryKey: ["user_questions"],
    queryFn: () => userService.getUserQuestions(),
  });
}

export function useAnsweredQuestions() {
  return useQuery({
    queryKey: ["answered_questions"],
    queryFn: userService.getAnsweredQuestions,
  });
}
