import {
  DeleteItemOutput,
  DocumentClient,
  PutItemOutput,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { secrets } from './config';
import { startMonth } from './routes/monobank/utils';
import {
  GetOutput,
  KeyData,
  MonoStatement,
  PartialOutput,
  Schema,
  Tables,
} from './routes/types/types';

const documentClient = new DocumentClient({
  accessKeyId: secrets.ACCESS_KEY,
  secretAccessKey: secrets.SECRET_ACCESS_KEY,
  region: secrets.REGION,
});

export const getItem = async <T extends Tables>(
  table: T,
  keyData: KeyData<T>
): Promise<GetOutput<T> | AWSError> => {
  const params = {
    TableName: table,
    Key: keyData,
  };

  return await documentClient
    .get(params)
    .promise()
    .catch((err) => err);
};

export const putItem = async <T extends Tables>(
  table: T,
  keyData: KeyData<T>
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

// refactor to query
export const getTokens = async (
  table: string
): Promise<ScanOutput | AWSError> => {
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

export const getAttributesFromTable = async <
  T extends Tables,
  K extends keyof Schema[T]
>(
  table: T,
  keyData: KeyData<T>,
  attributes: Array<K>
): Promise<AWSError | PartialOutput<T, K>> => {
  const params = {
    TableName: table,
    Key: keyData,
    AttributesToGet: attributes.map((attr) => attr.toString()),
  };
  return await documentClient
    .get(params)
    .promise()
    .catch((e) => e);
};

export const deleteItem = async <T extends Tables>(
  table: T,
  keyData: KeyData<T>
): Promise<DeleteItemOutput | AWSError> => {
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
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, string> = {};

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

export const updateItem = async <T extends Tables>(
  table: T,
  keyData: KeyData<T>,
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

export const appendStatement = async <T extends Tables.STATEMENTS>(
  keyData: KeyData<T>,
  statementItem: MonoStatement,
  keyPath?: string
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: Tables.STATEMENTS,
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

export const incrementStatementSpendings = async <T extends Tables.STATEMENTS>(
  keyData: KeyData<T>,
  incValue: number,
  index: number
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: Tables.STATEMENTS,
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
