import type { ChartData, Statement } from './types/Api';
import type { Validator } from './types/Layout';

const isUpper = (char: string): boolean => char === char.toUpperCase();

export const validatePassword: Validator = (pwd?: string): boolean =>
  pwd && pwd.length >= 8 && /.{8,}/.test(pwd) && [...pwd].some(isUpper);

export const validatePhone: Validator = (number?: string): boolean =>
  number && number.length === 10 && Number(number) !== NaN;

export const waitFor = (seconds: number): Promise<void> =>
  new Promise((res) => setTimeout(res, seconds * 1000));

const p2p = 16;

const isOtherCategory = ({ id }: ChartData | Statement): boolean => id === p2p;

const hasValues = ({ limit, previous, current }: ChartData): boolean =>
  !!(previous || limit || current);

export const parseStatements = (statement: ChartData[]): ParsedStatements => {
  if (!statement) return { budgeted: [], unbudgeted: [] };

  const budgeted = statement
    .filter((chart) => !isOtherCategory(chart))
    .filter(hasValues);

  const [other] = statement.filter(isOtherCategory);

  const unbudgeted = statement.filter((chart) => !hasValues(chart));

  return {
    budgeted,
    other,
    unbudgeted,
  };
};
