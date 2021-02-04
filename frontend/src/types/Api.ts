export type SuccessResponse = { user_id: string; status: 200 };
export type FailureResponse = { status: number; message: string };
export type APIResponse = SuccessResponse | FailureResponse;
