import {
  DeleteItemOutput,
  DocumentClient,
  PutItemOutput,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { secrets } from './config';
import { startMonth } from './routes/monobank/utils';
import { isFailure } from './routes/types/guards';
import {
  GetOutput,
  KeyData,
  MonoStatement,
  PartialOutput,
  Schema,
  Tables,
} from './routes/types/types';
import { AWSNotFound } from './utils';

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

export const appendStatement = async <T extends Tables.STATEMEN>(
  keyData: KeyData<T>,
  statementItem: MonoStatement,
  keyPath?: string
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: Tables.STATEMEN,
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

export const incrementStatementSpendings = async <T extends Tables.STATEMEN>(
  keyData: KeyData<T>,
  incValue: number,
  index: number
): Promise<PutItemOutput | AWSError> => {
  const startDate = startMonth('cur');
  const k = `#${startDate}`;
  const params = {
    TableName: Tables.STATEMEN,
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

// type refactor
// TODO: Is this function must be in dynamodb api? (move logic)
export const moneySpentToLimit = async (
  key: KeyData<Tables.STATEMEN>,
  categoryId: number
): Promise<
  AWSError | { limit?: number; moneySpent: number; username: string }
> => {
  const currentMounth = startMonth('cur');
  const output = await getAttributesFromTable(Tables.STATEMEN, key, [
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
