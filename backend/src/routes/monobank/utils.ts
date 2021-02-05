import { StatementRequest } from '../types/types';

export const requiredFields = ({
  account,
  from,
  to,
  previous,
}: Partial<StatementRequest>): StatementRequest => {
  const date = new Date(Date.now());
  const dateFrom = new Date(date.getFullYear(), date.getMonth() - 1).valueOf();
  const dateTo = new Date(date.getFullYear(), date.getMonth()).valueOf();

  return {
    account: account || 0,
    from: from || dateFrom,
    to: to || dateTo,
    previous: !!previous,
  };
};
