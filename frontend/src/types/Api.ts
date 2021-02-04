export type SuccessResponse<T> = { data: T; status: 200 };
export type FailureResponse = { status: number; message: string };
export type APIResponse<T = any> = SuccessResponse<T> | FailureResponse;
export type UserInfo = {
  clientId: string;
  name: string;
  accounts: [
    {
      id: 'S3uUiJEW20GuVOEuS67iNw';
      currencyCode: 980;
      cashbackType: 'UAH';
      balance: 729214;
      creditLimit: 200000;
      maskedPan: ['537541******3975'];
      type: 'black' | 'white';
    }
  ];
};
