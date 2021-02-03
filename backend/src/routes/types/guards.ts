import { AWSError } from 'aws-sdk';

export const isFailure = (response: any): response is AWSError =>
  response.statusCode === 400;

export const exist = (...fields: string[]): boolean =>
  fields.every((field) => !!field);
