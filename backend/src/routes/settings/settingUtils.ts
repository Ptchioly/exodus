import { deleteItem, updateItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';
import { APIError, EndpointRes, Tables } from '../types/types';

export const deleteAccounts = async (
  table: Tables.STATEMENTS,
  accounts: string[]
): Promise<boolean> =>
  Promise.allSettled(
    accounts.map((account) => deleteItem(table, { accountId: account }))
  ).then((results) => !results.some(isFailure));

export const updateUserInfo = (
  username: string,
  respond: EndpointRes
) => async (obj: Record<string, string>): Promise<void> => {
  const updateUserResponse = await updateItem(Tables.USERS, { username }, obj);

  return isFailure(updateUserResponse)
    ? respond.FailureResponse(APIError.UNABLE_UPDATE_USER) //'Failed to update user info'
    : respond.SuccessResponse();
};
