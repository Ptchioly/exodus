import { configs } from '../../config';
import { getItem, putItem, updateItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';
import { GetOutput, StatementRequest } from '../types/types';

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

const checkMonth = (timestamp: number): boolean => {
  return timestamp < new Date(new Date(Date.now()).getMonth()).valueOf();
};

export const statementUpdate = async (
  userFromDB: GetOutput,
  timestamp: number,
  data: any[],
  processedData: any[]
): Promise<void> => {
  const accounts = userFromDB.Item.accounts;
  accounts.forEach(async (id) => {
    await getItem(configs.STATEMENTS_TABLE, {
      accountId: id,
    }).then((dbItem) => {
      const newObject = { rawData: data, processedData };
      if (Object.keys(dbItem).length > 0) {
        if (!checkMonth(timestamp))
          updateItem(
            configs.STATEMENTS_TABLE,
            { accountId: id },
            { [timestamp]: newObject, username: userFromDB.Item.username }
          );
      } else
        putItem(configs.STATEMENTS_TABLE, {
          accountId: id,
          [timestamp]: newObject,
          username: userFromDB.Item.username,
        });
    });
  });
};

export const updateLimit = async (
  userId: string,
  timestamp: number,
  category: string,
  value: number
): Promise<void> => {
  const key = { accountId: userId };
  const sobaka = (await getItem(configs.STATEMENTS_TABLE, key)) as any;
  if (!isFailure(sobaka)) {
    const newData = sobaka.Item[timestamp].processedData.reduce(
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
          rawData: sobaka.Item[timestamp].rawData,
        },
      }
    );
  } else console.log('error');
};
