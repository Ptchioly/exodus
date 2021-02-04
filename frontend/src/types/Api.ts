export type SignedIn = { user_id: string; status: 200 };
export type Unsigned = { status: number; message: string };
export type APIResponse = SignedIn | Unsigned;
