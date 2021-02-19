import { AWSError } from 'aws-sdk';
import {
  getAttributesFromTable,
  getItem,
  putItem,
  updateItem,
} from '../../dynamoAPI';
import { AWSNotFound } from '../../utils';
import { isFailedFetchMono, isFailure } from '../types/guards';
import { GetOutput, KeyData, LimitCategory, Tables } from '../types/types';
import { getStatements } from './endpoints';
import { categorize } from './paymentsProcessing';

export const statementsDate = (month: 'previous' | 'current'): number => {
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

const retreiveCategorizedStatement = async (
  account: any, //???
  time: { start: number; finish: number },
  xtoken: string
): Promise<{ data: any; categorizedData: LimitCategory[] }> => {
  const data = await getStatements(
    { account, from: time.start, to: time.finish },
    xtoken
  );

  if (isFailedFetchMono(data)) return { data: [], categorizedData: [] };
  const categorizedData = categorize(data);
  return { data, categorizedData };
};

export const syncStatements = async (
  user: GetOutput<Tables.USERS>
): Promise<void> => {
  const start = startMonth('prev');
  const finish = startMonth('cur');
  const prevmonthTime = { start, finish };
  const currentmonthTime = {
    start: finish,
    finish: startMonth('next'),
  };
  const { data, categorizedData } = await retreiveCategorizedStatement(
    user.Item.accounts[0],
    currentmonthTime,
    user.Item.xtoken
  );
  await statementUpdate(user, finish, data, categorizedData);

  setTimeout(async () => {
    const { data, categorizedData } = await retreiveCategorizedStatement(
      user.Item.accounts[0],
      prevmonthTime,
      user.Item.xtoken
    );

    await statementUpdate(user, start, data, categorizedData);
  }, 65000);
};

export const statementUpdate = async (
  userFromDB: GetOutput<Tables.USERS>,
  timestamp: number,
  data: any[],
  processedData: LimitCategory[]
): Promise<void> => {
  const account = userFromDB.Item.accounts[0];
  const dbItem = await getItem(Tables.STATEMENTS, {
    accountId: account,
  });
  const newObject = { rawData: data, processedData };

  Object.keys(dbItem).length > 0
    ? await updateItem(
        Tables.STATEMENTS,
        { accountId: account },
        { [timestamp]: newObject, username: userFromDB.Item.username }
      )
    : await putItem(Tables.STATEMENTS, {
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
  const statements = await getItem(Tables.STATEMENTS, key);
  if (!isFailure(statements)) {
    const newData = statements.Item[timestamp].processedData.reduce(
      (accum: any, el) => {
        if (el.category === category) el.limit = value;
        accum.push(el);
        return accum;
      },
      []
    );
    updateItem(
      Tables.STATEMENTS,
      { accountId: userId },
      {
        [timestamp]: {
          processedData: newData,
          rawData: statements.Item[timestamp].rawData,
        },
      }
    );
  }
};

export const moneySpentToLimit = async (
  key: KeyData<Tables.STATEMENTS>,
  categoryId: number
): Promise<
  AWSError | { limit?: number; moneySpent: number; username: string }
> => {
  const currentMounth = startMonth('cur');
  const output = await getAttributesFromTable(Tables.STATEMENTS, key, [
    currentMounth,
    'username',
  ]);

  if (isFailure(output)) return output;
  const { username } = output.Item;
  const categories = output.Item[currentMounth];
  if (!categories)
    return AWSNotFound('There are no categories for current mounth');

  const category = categories.processedData.find(
    (category) => category.id === categoryId
  );

  if (!category) return AWSNotFound('No such category');

  const { limit, moneySpent } = category;
  return {
    limit,
    moneySpent,
    username,
  };
};
