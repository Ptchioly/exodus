export type SignedIn = { user_id: string; status: 200 };
export type Unsigned = { status: number; message: string };
export type LoginResponse = SignedIn | Unsigned;
