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

export type ChartData = {
  id: number;
  title: string;
  previous: number;
  current: number;
  limit: number;
};

export type Statement = {
  category: string;
  moneySpent: number;
  limit: number;
  id: number;
};

export type StatementHandler = (statement: Statement) => number;

export type Account = {
  id: string;
  type: 'black' | 'white' | 'platinum' | 'iron' | 'fop' | 'yellow';
  balance: number;
  pan: string[];
  currency: string;
};

export type CardType =
  | 'black'
  | 'white'
  | 'platinum'
  | 'iron'
  | 'fop'
  | 'yellow'
  | 'all';

export type AccountId = string;
export type ParsedStatements = {
  budgeted: ChartData[];
  unbudgeted: ChartData[];
  other?: ChartData;
};
