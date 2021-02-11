import { AWSError } from 'aws-sdk';

export const isFailure = (response: any): response is AWSError =>
  response.statusCode === 400;

export const exist = (...fields: string[]): boolean =>
  fields.every((field) => !!field);

export const atLeast = (...fields: string[]): boolean =>
  fields.some((field) => !!field);

export const hasKey = <T, K extends number | string>(
  object: T,
  key: K
): object is T & { [k in K]: any } => {
  return key in object;
};
