import { LimitCategory, ChartData, StatementHandler } from '../types/types';

const equalId = (searchId: number) => ({ id }: LimitCategory): boolean =>
  id === searchId;

const limitPrioriry = (prev: ChartData, next: ChartData): number =>
  next.current - prev.current || next.previous - prev.previous;

const processStatement = (
  forCurrent: StatementHandler,
  forPrevious: StatementHandler
) => (statement: LimitCategory): ChartData => {
  const { id, limit, category } = statement;
  return {
    previous: forPrevious(statement),
    current: forCurrent(statement),
    limit: limit || 0,
    title: category,
    id,
  };
};

export default (
  currentMonth: LimitCategory[],
  previousMonth?: LimitCategory[]
): ChartData[] => {
  const current = currentMonth.map(
    processStatement(
      (current) => current.moneySpent,
      (previous) =>
        (previousMonth &&
          previousMonth.find(equalId(previous.id))?.moneySpent) ||
        0
    )
  );

  const previous = previousMonth
    ? previousMonth
        .filter(({ id }) => !currentMonth.find(equalId(id)))
        .map(
          processStatement(
            (_) => 0,
            (previous) => previous.moneySpent
          )
        )
    : [];

  return [...current, ...previous].sort(limitPrioriry);
};
