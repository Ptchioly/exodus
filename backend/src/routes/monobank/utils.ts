import { StatementRequest } from '../types/types';

export const requiredFields = ({
  account,
  from,
  to,
  previous,
}: Partial<StatementRequest>): StatementRequest => {
  const date = Date.now();
  const dateFrom = date - 2678400000;
  const dateTo = date;

  return {
    account: account || 0,
    from: from || dateFrom,
    to: to || dateTo,
    previous: !!previous,
  };
};
