import type { LoginResponse, SignedIn } from './Api';

export const isSignedIn = (
  apiResponse: LoginResponse
): apiResponse is SignedIn => apiResponse.status === 200;
