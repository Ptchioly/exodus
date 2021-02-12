import { DocumentClient, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { configs, secrets } from './config';
import { GetOutput } from './routes/types/types';

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
