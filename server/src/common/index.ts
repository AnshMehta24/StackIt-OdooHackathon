type SuccessResponse<T> = {
  success: true;
  message?: string;
  data?: T;
};

type ErrorResponse<T> = {
  success: false;
  errors: {
    message: string;
    data?: T;
  };
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse<T>;

export const successResponse = <T>({
  data,
  message,
}: {
  data?: T;
  message?: string;
}): ApiResponse<T> => {
  return { success: true, data, message };
};

export const errorResponse = <T>({
  data,
  message,
}: {
  data?: T;
  message: string;
}): ApiResponse<T> => {
  return { success: false, errors: { message, data } };
};
