import { Router } from 'express';
import { categories } from '../../../mccCategories';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure, isFetchedStatement } from '../types/guards';
import { ChartData, Tables } from '../types/types';
import mergeStatements from './mergeStatements';
import { getCategoriesTemplate } from './paymentsProcessing';
import { startMonth } from './utils';

export const statement = Router();

const countTotal = (data: ChartData[], field: 'previous' | 'current'): number =>
  data.reduce((acc, info) => (acc += info[field]), 0);

// refactor
const formTotal = (
  data: ChartData[]
): { [k in 'previous' | 'current']: number } =>
  ['previous', 'current'].reduce(
    (acc, field: any) => ({ ...acc, [field]: countTotal(data, field) }),
    {} as any
  );

// REFACTOR
statement.get('/statement', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);
  const ids: string[] = req.query.ids.split(',');

  const current = startMonth('cur');
  const previous = startMonth('prev');

  let synced = false;
  const statements = await Promise.all(
    ids.map(async (accountId) => {
      const statement = await getItem(Tables.STATEMENTS, {
        accountId,
      });

      if (isFailure(statement)) return { message: statement.message };
      if (!statement.Item) return { message: 'Statement is empty' };

      const currentStatement = hasKey(statement.Item, current)
        ? statement.Item[current].processedData
        : getCategoriesTemplate(categories);
      const previousStatement = statement.Item[previous]?.processedData;
      const merged = mergeStatements(currentStatement, previousStatement);
      synced = !!previousStatement;
      return {
        accountId,
        total: formTotal(merged),
        statements: merged,
        message: 'OK',
      };
    })
  );

  const mergeAll = statements.reduce((acc: ChartData[], account) => {
    if (!isFetchedStatement(account)) return acc;
    if (acc.length === 0) return account.statements;
    const mergedChart = account.statements.map((a) => {
      const found = acc.find((el) => el.id === a.id) as ChartData;
      return {
        ...found,
        previous: found.previous + a.previous,
        current: found.current + a.current,
        limit: +found.limit + +a.limit,
      };
    });
    if (!mergedChart) return acc;
    return mergedChart;
  }, []);

  const total = formTotal(mergeAll);

  return respond.SuccessResponse({ all: mergeAll, statements, synced, total });
});
