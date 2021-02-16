import { configs } from '../../config';
import { getItem, putItem, updateItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';
import { GetOutput, LimitCategory, StatementRequest } from '../types/types';
import { requests } from './endpoints';
import { categorize } from './paymentsProcessing';
import fetch from 'node-fetch';

export const statementStartDate = (month: 'previous' | 'current'): number => {
  return month === 'current' ? startMonth('cur') : startMonth('prev');
};

export const startMonth = (variant: 'prev' | 'cur' | 'next'): number => {
  const date = new Date();
  switch (variant) {
    case 'prev':
      return Date.UTC(date.getFullYear(), date.getMonth() - 1);
    case 'cur':
      return Date.UTC(date.getFullYear(), date.getMonth());
    case 'next':
      return Date.UTC(date.getFullYear(), date.getMonth() + 1);
  }
};

const fetchStatement = async (
  account: any, //???
  time: { start: number; finish: number },
  xtoken: string
): Promise<{ data: any; categorizedData: LimitCategory[] }> => {
  console.log('time', time);
  const data = await fetch(
    requests.statement(account, time.start, time.finish),
    {
      headers: {
        'X-Token': xtoken,
      },
    }
  ).then((el) => el.json());
  console.log('data', data);

  const categorizedData = categorize(data);
  return { data, categorizedData };
};

export const syncStatements = async (user: GetOutput): Promise<void> => {
  const start = startMonth('prev');
  const finish = startMonth('cur');
  const prevmonthTime = { start, finish };
  const currentmonthTime = {
    start: finish,
    finish: startMonth('next'),
  };
  const { data, categorizedData } = await fetchStatement(
    user.Item.accounts[0],
    currentmonthTime,
    user.Item.xtoken
  );
  await statementUpdate(user, finish, data, categorizedData);

  setTimeout(async () => {
    const { data, categorizedData } = await fetchStatement(
      user.Item.accounts[0],
      prevmonthTime,
      user.Item.xtoken
    );

    await statementUpdate(user, start, data, categorizedData);
  }, 70000);
};

export const statementUpdate = async (
  userFromDB: GetOutput,
  timestamp: number,
  data: any[],
  processedData: LimitCategory[]
): Promise<void> => {
  const account = userFromDB.Item.accounts[0];
  const dbItem = await getItem(configs.STATEMENTS_TABLE, {
    accountId: account,
  });
  const newObject = { rawData: data, processedData };

  Object.keys(dbItem).length > 0
    ? await updateItem(
        configs.STATEMENTS_TABLE,
        { accountId: account },
        { [timestamp]: newObject, username: userFromDB.Item.username }
      )
    : await putItem(configs.STATEMENTS_TABLE, {
        accountId: account,
        [timestamp]: newObject,
        username: userFromDB.Item.username,
      });
};

export const updateLimit = async (
  userId: string,
  category: string,
  value: number,
  timestamp = startMonth('cur')
): Promise<void> => {
  const key = { accountId: userId };
  const statements = (await getItem(configs.STATEMENTS_TABLE, key)) as any;
  if (!isFailure(statements)) {
    const newData = statements.Item[timestamp].processedData.reduce(
      (accum: any, el: any) => {
        if (el.category === category) el.limit = value;
        accum.push(el);
        return accum;
      },
      []
    );
    updateItem(
      configs.STATEMENTS_TABLE,
      { accountId: userId },
      {
        [timestamp]: {
          processedData: newData,
          rawData: statements.Item[timestamp].rawData,
        },
      }
    );
  } else console.log('error');
};
