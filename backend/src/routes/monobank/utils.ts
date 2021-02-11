import { configs } from '../../config';
import { getItem, putItem, updateItem } from '../../dynamoAPI';
import { GetOutput, LimitCategory, StatementRequest } from '../types/types';
import { requests } from './endpoints';
import { categorize } from './paymentsProcessing';
import fetch from 'node-fetch';

export const requiredFields = ({
  account,
  from,
  to,
  previous,
}: StatementRequest): StatementRequest => {
  const date = new Date(Date.now());
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const previousMonth = currentMonth > 0 ? currentMonth - 1 : 11;
  const yearCheck = previousMonth !== 11 ? currentYear : currentYear - 1;
  const dateFrom = new Date(yearCheck, previousMonth).valueOf();
  return {
    account,
    from: from || dateFrom,
    to,
    previous: !!previous,
  };
};

const startMounth = (variant: 'prev' | 'cur' | 'next'): Date => {
  const date = new Date();
  switch (variant) {
    case 'prev':
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    case 'cur':
      return new Date(date.getFullYear(), date.getMonth(), 1);
    case 'next':
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }
};

const fetchStatement = async (
  account: string | 0, //???
  time: { start: number; finish: number },
  xtoken: string
): Promise<{ data: any; categorizedData: LimitCategory[] }> => {
  const data = await fetch(
    requests.statement(account, time.start, time.finish),
    {
      headers: {
        'X-Token': xtoken,
      },
    }
  ).then((el) => el.json());

  const categorizedData = categorize(data);
  return { data, categorizedData };
};

export const syncStatements = async (user: GetOutput): Promise<void> => {
  const account = 0; //stubbb
  const start = startMounth('prev').getTime();
  const finish = startMounth('cur').getTime();
  const prevMounthTime = { start, finish };
  const currentMounthTime = {
    start: finish,
    finish: startMounth('next').getTime(),
  };
  const { data, categorizedData } = await fetchStatement(
    account,
    currentMounthTime,
    user.Item.xtoken
  );
  await statementUpdate(user, finish, data, categorizedData);
  console.log('Data updated for current mounth');

  setTimeout(async () => {
    const { data, categorizedData } = await fetchStatement(
      account,
      prevMounthTime,
      user.Item.xtoken
    );

    await statementUpdate(user, start, data, categorizedData);
    console.log('Data updated for previous mounth');
  }, 70000);
};

export const statementUpdate = async (
  userFromDB: GetOutput,
  timestamp: number,
  data: any[],
  processedData: LimitCategory[]
): Promise<void> => {
  const accounts = userFromDB.Item.accounts;
  accounts.forEach(async (id) => {
    const dbItem = await getItem(configs.STATEMENTS_TABLE, {
      accountId: id,
    });
    const newObject = { rawData: data, processedData };

    const out =
      Object.keys(dbItem).length > 0
        ? await updateItem(
            configs.STATEMENTS_TABLE,
            { accountId: id },
            { [timestamp]: newObject, username: userFromDB.Item.username }
          )
        : await putItem(configs.STATEMENTS_TABLE, {
            accountId: id,
            [timestamp]: newObject,
            username: userFromDB.Item.username,
          });
  });
};
