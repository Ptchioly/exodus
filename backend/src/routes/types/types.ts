export type GetOutput<T extends Tables> = {
  Item: Schema[T];
};
export type PartialOutput<T extends Tables, K extends keyof Schema[T]> = {
  Item: Pick<Schema[T], K>;
};

export type PrimaryKey = {
  [Tables.STATEMENTS]: 'accountId';
  [Tables.USERS]: 'username';
};

export enum Tables {
  STATEMENTS = 'statements',
  USERS = 'users',
}
export type Schema = {
  [Tables.STATEMENTS]: Statement;
  [Tables.USERS]: Users;
};

export type KeyData<T extends Tables> = Record<PrimaryKey[T], string> &
  Partial<Schema[T]>;

export enum ResponseType {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

export type Users = {
  id: string;
  key: string;
  name: string;
  username: string;
  password: string;
  xtoken: string;
  telegramId?: string;
  accounts: Account[];
};

export type Statement = {
  accountId: string;
  username: string;
  [k: number]: {
    rawData: MonoStatement[];
    processedData: LimitCategory[];
  };
};

export type UserMeta = {
  username: string;
};

export type StatementRequest = {
  month: 'previous' | 'current';
};

export type Category = {
  mcc: {
    numbers: number[];
    ranges: number[][];
  };
  category: string;
  id: number;
};

export type LimitCategory = {
  category: string;
  id: number;
  limit?: number;
} & {
  moneySpent: number;
};

export type Payment = {
  category: string;
  categoryId: number;
  description: string;
  amount: number;
};

export type MonoClientInfo = {
  clientId: string;
  name: string;
  webHookUrl: string;
  accounts: MonoAccount[];
};

export type MonoFailedFetch = {
  errorDescription: string;
};

export type MonoAccount = {
  id: string;
  currencyCode: 980 | 985 | 840 | 978;
  cashbackType: 'None' | 'UAH' | 'Miles';
  balance: number;
  creditLimit: number;
  maskedPan: string[];
  type: 'black' | 'white' | 'platinum' | 'iron' | 'fop' | 'yellow';
  iban: string;
};

export type ClientInfo = {
  name: string;
  webHookUrl: string;
  accounts: Account[];
};

export type Account = {
  id: string;
  type: 'black' | 'white' | 'platinum' | 'iron' | 'fop' | 'yellow';
  balance: number;
  pan: string[];
  currency: string;
};

export type StatementItems = {
  type: 'StatementItem';
  data: {
    account: string;
    statementItem: MonoStatement;
  };
};

export type MonoStatements = MonoStatement[];

export type MonoStatement = {
  id: string;
  time: number;
  description: string;
  mcc: number;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  hold: boolean;
};

export type AccountInfo = {
  amount: number;
  balance: number;
  cashbackAmount: number;
  commissionRate: number;
  currencyCode: number;
  description: string;
  hold: boolean;
  id: string;
  mcc: number;
  operationAmount: number;
  time: number;
};

export type ChartData = {
  id: number;
  title: string;
  previous: number;
  current: number;
  limit: number;
  prevLimit?: number;
};

export interface StatementHandler {
  (statement: LimitCategory): Pick<LimitCategory, 'limit' | 'moneySpent'>;
}

export type MergedStatement = {
  message: string;
  accountId?: string;
  statements?: ChartData[];
};

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

export type EndpointRes = {
  SuccessResponse: (data?: Record<string, any>, status?: number) => void;
  FailureResponse: (error: APIError) => void;
};
