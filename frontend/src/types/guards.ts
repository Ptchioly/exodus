import type { APIResponse, SuccessResponse } from './Api';

export const isSuccessResponse = (
  apiResponse: APIResponse
): apiResponse is SuccessResponse => apiResponse.status === 200;
