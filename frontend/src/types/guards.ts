import type { APIResponse, SuccessResponse } from './Api';

export const isSuccessResponse = <T>(
  apiResponse: APIResponse<T>
): apiResponse is SuccessResponse<T> => apiResponse.status === 200;
