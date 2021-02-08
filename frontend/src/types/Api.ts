export type SuccessResponse<T> = { data: T; status: 200 };
export type FailureResponse = { status: number; message: string };
export type APIResponse<T = any> = SuccessResponse<T> | FailureResponse;
export type UserInfo = {
  clientId: string;
  name: string;
  accounts: [
    {
      id: string;
      currencyCode: number;
      cashbackType: 'string';
      balance: number;
      creditLimit: number;
      maskedPan: string[];
      type: 'black' | 'white';
    }
  ];
};

export type OnResponseCB = (response: Response) => void;
export interface RequestsQueue {
  pushRequest: (url: string, init?: RequestInit) => void;
  onResponse: (cb: OnResponseCB) => void;
}
