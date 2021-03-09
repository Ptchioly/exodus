import { AWSError } from 'aws-sdk';
import {
  getAttributesFromTable,
  getItem,
  putItem,
  updateItem,
} from '../../dynamoAPI';
import { AWSNotFound } from '../../utils';
import { isFailedFetchMono, isFailure } from '../types/guards';
import { KeyData, LimitCategory, Tables, Users } from '../types/types';
import { getStatements } from './endpoints';
import { categorize } from './paymentsProcessing';

//Refactor
export const statementsDate = (month: 'previous' | 'current'): number => {
  return month === 'current' ? startMonth('cur') : startMonth('prev');
};

//Refactor
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
  account: string,
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

//Refactor
export const syncStatements = async (user: Users): Promise<void> => {
  const { accounts, xtoken, username } = user;
  const start = startMonth('prev');
  const finish = startMonth('cur');
  const prevMonthTime = { start, finish };
  const currentMonthTime = {
    start: finish,
    finish: startMonth('next'),
  };
  await Promise.all(
    accounts.map(async (account) => {
      const { data, categorizedData } = await retreiveCategorizedStatement(
        account.id,
        currentMonthTime,
        xtoken
      );
      await statementUpdate(
        account.id,
        username,
        finish,
        data,
        categorizedData
      );
    })
  );

  setTimeout(async () => {
    await Promise.all(
      accounts.map(async (account) => {
        const { data, categorizedData } = await retreiveCategorizedStatement(
          account.id,
          prevMonthTime,
          xtoken
        );

        await statementUpdate(
          account.id,
          username,
          start,
          data,
          categorizedData
        );
      })
    );
  }, 65000);
};

export const statementUpdate = async (
  accountId: string,
  username: string,
  timestamp: number,
  data: any[],
  processedData: LimitCategory[]
): Promise<void> => {
  const dbItem = await getItem(Tables.STATEMENTS, {
    accountId,
  });
  const newObject = { rawData: data, processedData };

  Object.keys(dbItem).length > 0
    ? await updateItem(
        Tables.STATEMENTS,
        { accountId },
        { [timestamp]: newObject, username }
      )
    : await putItem(Tables.STATEMENTS, {
        accountId,
        [timestamp]: newObject,
        username,
      });
};

export const updateLimit = async (
  accountId: string,
  categoryId: number,
  value: number,
  timestamp = startMonth('cur')
): Promise<void> => {
  const key = { accountId };
  const statements = await getItem(Tables.STATEMENTS, key);
  if (!isFailure(statements)) {
    const newData = statements.Item[timestamp].processedData.reduce(
      (accum: any, el) => {
        if (el.id === categoryId) el.limit = value;
        accum.push(el);
        return accum;
      },
      []
    );
    updateItem(
      Tables.STATEMENTS,
      { accountId },
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
