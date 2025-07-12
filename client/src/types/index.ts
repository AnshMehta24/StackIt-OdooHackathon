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

export type ProfileRoles = " INSTRUCTOR" | "STUDENT";
