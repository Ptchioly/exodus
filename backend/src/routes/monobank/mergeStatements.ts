import { LimitCategory, ChartData, StatementHandler } from '../types/types';

const equalId = (searchId: number) => ({ id }: LimitCategory): boolean =>
  id === searchId;

const limitPrioriry = (prev: ChartData, next: ChartData): number =>
  next.current - prev.current || next.previous - prev.previous;

const processStatement = (
  forCurrent: StatementHandler,
  forPrevious: StatementHandler
) => (statement: LimitCategory): ChartData => {
  const { id, category } = statement;
  const { moneySpent: current, limit } = forCurrent(statement);
  console.log(1);
  const { moneySpent: previous, limit: prevLimit } = forPrevious(statement);
  console.log(2);
  return {
    previous,
    current,
    limit: limit || 0,
    title: category,
    id,
    prevLimit,
  };
};

export default (
  currentMonth: LimitCategory[],
  previousMonth?: LimitCategory[]
): ChartData[] => {
  const processCurrentStatement = processStatement(
    ({ moneySpent, limit }) => ({ moneySpent, limit }),
    ({ id }: LimitCategory) => {
      const cat = previousMonth?.find(equalId(id));
      return {
        moneySpent: cat?.moneySpent || 0,
        limit: cat?.limit || 0,
      };
    }
  );

  const processPreviousStatement = processStatement(
    (_) => ({ moneySpent: 0, limit: 0 }),
    ({ moneySpent, limit }) => ({ moneySpent, limit })
  );

  const current = currentMonth.map(processCurrentStatement);

  const previous = previousMonth
    ? previousMonth
        .filter(({ id }) => !currentMonth.find(equalId(id)))
        .map(processPreviousStatement)
    : [];

  return [...current, ...previous].sort(limitPrioriry);
};
