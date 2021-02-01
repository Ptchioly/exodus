import { DocumentClient, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { secrets } from './config';
import { GetOutput, Users } from './routes/types/types';

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

export const putItem = async (
  table: string,
  keyData: Users
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
