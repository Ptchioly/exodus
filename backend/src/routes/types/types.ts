export type GetOutput = {
  Item: Users;
};

export type Users = {
  id: string;
  key: string;
  username: string;
  password: string;
  xtoken: string;
};

export type UserMeta = {
  username: string;
};

export type StatementRequest = {
  account: 0 | string;
  from: number;
  to?: number;
};

export type Category = {
  mcc: {
    numbers: number[],
    ranges: number[][]
  },
  category: string
  id: number,
}

export type LimitCategory = {
  name: string,
  currMonth: number,
  prevMonth: number,
  limit: number,
  id: number,
}

export type Payment = {
  category: string
  categoryId: number,
  description: string
  operationAmount: number,
  time: number,
}