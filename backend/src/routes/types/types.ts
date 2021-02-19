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
  accounts: string[];
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
  currencyCode: number;
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

type Account = {
  id: string;
  currencyCode: number;
  balance: number;
  creditLimit: number;
  type: string;
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
