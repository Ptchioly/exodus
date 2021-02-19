import { deleteItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';
import { Tables } from '../types/types';

export const deleteAccounts = async (
  table: Tables.STATEMENTS,
  accounts: string[]
): Promise<boolean> =>
  Promise.allSettled(
    accounts.map((account) => deleteItem(table, { accountId: account }))
  ).then((results) => !results.some(isFailure));
