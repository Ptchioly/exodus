import type {
  ChartData,
  ParsedStatements,
  Statement,
  Total,
} from './types/Api';

export const waitFor = (seconds: number): Promise<void> =>
  new Promise((res) => setTimeout(res, seconds * 1000));

const p2p = 16;

const isOtherCategory = ({ id }: ChartData | Statement): boolean => id === p2p;

const hasValues = ({ limit, previous, current }: ChartData): boolean =>
  !!(previous || limit || current);

export const parseStatements = (
  statement: ChartData[],
  total: Total
): ParsedStatements => {
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
    total: total,
  };
};
