import { AWSError } from 'aws-sdk';
import { MergedStatement, MonoFailedFetch } from './types';

export const isFailure = (response: any): response is AWSError =>
  response.statusCode;

export const exist = (...fields: string[]): boolean =>
  fields.every((field) => !!field);

export const atLeast = (...fields: string[]): boolean =>
  fields.some((field) => !!field);

export const isFailedFetchMono = (info: any): info is MonoFailedFetch =>
  !!info.errorDescription;

export const hasKey = <T, K extends number | string>(
  object: T,
  key: K
): object is T & { [k in K]: any } => {
  return key in object;
};
export const isValidMonthVariant = (m: string): m is 'previous' | 'current' =>
  m === 'previous' || m === 'current';

export const isFetchedStatement = (
  account: MergedStatement
): account is Required<MergedStatement> => account.message === 'OK';
