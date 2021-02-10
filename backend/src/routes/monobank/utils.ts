import { configs } from '../../config';
import { getItem, putItem, updateItem } from '../../dynamoAPI';
import { GetOutput, StatementRequest } from '../types/types';

export const requiredFields = ({
  account,
  from,
  to,
  previous,
}: Partial<StatementRequest>): StatementRequest => {
  const date = new Date(Date.now());
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const previousMonth = currentMonth > 0 ? currentMonth - 1 : 11;
  const yearCheck = previousMonth !== 11 ? currentYear : currentYear - 1;
  const dateFrom = new Date(yearCheck, previousMonth).valueOf();
  return {
    account: account || 0,
    from: from || dateFrom,
    to: to,
    previous: !!previous,
  };
};

const checkMonth = (timestamp: number): boolean => {
  return timestamp < new Date(new Date(Date.now()).getMonth()).valueOf();
};

export const statementUpdate = async (
  userFromDB: GetOutput,
  timestamp: number,
  data: any[]
): Promise<void> => {
  const accounts = userFromDB.Item.accounts;
  accounts.forEach(async (id) => {
    await getItem(configs.STATEMENTS_TABLE, {
      accountId: id,
    }).then((dbItem) => {
      if (Object.keys(dbItem).length > 0) {
        if (!checkMonth(timestamp))
          updateItem(
            configs.STATEMENTS_TABLE,
            { accountId: id },
            { [timestamp]: data, username: userFromDB.Item.username }
          );
      } else {
        putItem(configs.STATEMENTS_TABLE, { accountId: id, [timestamp]: data });
      }
    });
  });
};
