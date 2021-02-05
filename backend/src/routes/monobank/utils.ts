import { StatementRequest } from '../types/types';

export const requiredFields = ({
  account,
  from,
  to,
  previous,
}: Partial<StatementRequest>): StatementRequest => {
  const date = new Date(Date.now());
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const previousMonth = currentMonth > 0 ? currentMonth - 1 : 11;
  const yearCheck = previousMonth !== 11 ? currentYear : currentYear - 1;
  const dateFrom = new Date(yearCheck, previousMonth).valueOf();
  return {
    account: account || 0,
    from: from || dateFrom,
    to: to,
    previous: !!previous,
  };
};
