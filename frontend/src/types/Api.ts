export enum APIError {
  OK = -1,
  MISSED_REQUIRED_FIELDS = 0,
  NOT_VALID_PHONE = 1,
  PWD_NOT_VALID = 2,
  TOKEN_NOT_VALID = 3,
  UNABLE_GET_USER = 4,
  NO_SUCH_USER = 5,
  PWD_INCORRCT = 6,
  UNABLE_CREATE_USER = 7,
  UNABLE_GET_TOKEN = 8,
  USER_ALREADY_EXISTS = 9,
  DB_ERROR = 10,
  TOKEN_ALREADY_REGISTRED = 11,
  MISSED_TOKEN = 12,
  VERIFICATION_ERROR = 13,
  CANT_UPDATE_STATEMENT = 14,
  EMPTY_BODY = 15,
  UNABLE_DELETE_USER = 16,
  UNABLE_UPDATE_USER = 17,
  AT_LEAST_ONE_FIELD = 18,
}

export type SuccessResponse<T> = { data: T; status: 200 };
export type FailureResponse = { status: number; error: APIError };

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

export type Total = {
  current: number;
  previous: number;
};

export type ChartData = {
  id: number;
  title: string;
  previous: number;
  current: number;
  limit: number;
  total: Total;
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
  total?: Total;
};
