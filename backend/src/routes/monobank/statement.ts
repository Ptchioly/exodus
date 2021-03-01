import { Router } from 'express';
import { categories } from '../../../mccCategories';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure } from '../types/guards';
import { Tables } from '../types/types';
import mergeStatements from './mergeStatements';
import { getCategoriesTemplate } from './paymentsProcessing';
import { startMonth } from './utils';

export const statement = Router();

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
        statements: merged,
        message: 'OK',
      };
    })
  );

  const mergeAll = statements.reduce((acc: any, account) => {
    if (account.message !== 'OK') return acc;
    if (acc.length === 0) return account.statements;
    return account.statements!.map((a) => {
      const found = acc.find((el: any) => el.id === a.id) as any;
      return {
        ...found,
        previous: found.previous + a.previous,
        current: found.current + a.current,
        limit: +found.limit + +a.limit,
      };
    });
  }, []);

  return respond.SuccessResponse({ all: mergeAll, statements, synced });
});
