import { DocumentClient, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { secrets } from './config';
import { startMonth } from './routes/monobank/utils';
import { isFailure } from './routes/types/guards';
import { GetOutput, MonoStatement } from './routes/types/types';

const documentClient = new DocumentClient({
  accessKeyId: secrets.ACCESS_KEY,
  secretAccessKey: secrets.SECRET_ACCESS_KEY,
  region: secrets.REGION,
});

export const getItem = async (
  table: string,
  keyData: any
): Promise<GetOutput | AWSError> => {
  const params = {
    TableName: table,
    Key: keyData,
  };

  return await documentClient
    .get(params)
    .promise()
    .catch((err) => err);
};

export const getTokens = async (table: string) => {
  const params = {
    ExpressionAttributeNames: {
      '#XT': 'xtoken',
    },
    ProjectionExpression: '#XT',
    TableName: table,
  };
  return await documentClient
    .scan(params)
    .promise()
    .catch((err) => err);
};

export const putItem = async (
  table: string,
  keyData: any
): Promise<PutItemOutput | AWSError> => {
  const params = {
    TableName: table,
    Item: keyData,
  };

  return await documentClient
    .put(params)
    .promise()
    .catch((err) => err);
};

export const deleteItem = async (
  table: string,
  keyData: any
): Promise<PutItemOutput | AWSError> => {
  const params = {
    TableName: table,
    Key: keyData,
  };

  return await documentClient
    .delete(params)
    .promise()
    .catch((err) => err);
};

const buildUpdateParam = (obj: Record<string, any>) => {
  const ExpressionAttributeNames: Record<string, any> = {};
  const ExpressionAttributeValues: Record<string, any> = {};

  const keys = Object.keys(obj).map((k) => {
    ExpressionAttributeNames['#' + k] = k;
    ExpressionAttributeValues[':' + k] = obj[k];
    return `#${k} = :${k}`;
  });
  return {
    UpdateExpression: `SET ${keys.join(', ')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

export const updateItem = async (
  table: string,
  keyData: any,
  obj: Record<string, any>
): Promise<PutItemOutput | AWSError> => {
  const params = {
    TableName: table,
    Key: keyData,
    ReturnValues: 'ALL_NEW',
    ...buildUpdateParam(obj),
  };

  return await documentClient
    .update(params)
    .promise()
    .catch((err) => err);
};

export const appendStatement = async (
  table: string,
  keyData: { accountId: string },
  statementItem: MonoStatement,
  keyPath?: string
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: table,
    Key: keyData,
    ReturnValues: 'ALL_NEW',
    UpdateExpression: `set #${startDate}.${keyPath} = list_append(if_not_exists(#${startDate}.${keyPath}, :empty_list), :statementItem)`,
    ExpressionAttributeNames: {
      [k]: `${startDate}`,
    },
    ExpressionAttributeValues: {
      ':statementItem': [statementItem],
      ':empty_list': [],
    },
  };

  return await documentClient
    .update(params)
    .promise()
    .catch((err) => err);
};

export const incrementStatemntSpendings = async (
  table: string,
  keyData: { accountId: string },
  incValue: number,
  index: number
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: table,
    Key: keyData,
    UpdateExpression: `set ${k}.processedData[${index}].moneySpent = ${k}.processedData[${index}].moneySpent + :val`,
    ExpressionAttributeNames: {
      [k]: `${startDate}`,
    },
    ExpressionAttributeValues: {
      ':val': incValue,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return await documentClient
    .update(params)
    .promise()
    .catch((err) => err);
};

export const deleteAccounts = async (table: string, accounts: string[]) =>
  Promise.allSettled(
    accounts.map((account) => deleteItem(table, { accountId: account }))
  ).then((results) => !results.some(isFailure));
