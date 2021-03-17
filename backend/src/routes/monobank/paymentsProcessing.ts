import { categories } from '../../../mccCategories';
import { isInRange } from '../../utils';
import { Category, LimitCategory, MonoStatements } from '../types/types';

const p2p = 16;

export const getMccCategory = (mccNumber: number): Category =>
  categories.find(
    ({ mcc }) =>
      mcc.numbers.includes(mccNumber) || isInRange(mcc.ranges, mccNumber)
  ) || categories[p2p];

export const getCategoriesTemplate = (
  categories: Category[]
): LimitCategory[] =>
  categories.map(({ category, id }) => ({
    category,
    id,
    moneySpent: 0,
  }));

const addAmount = ({ id }: Category, amount: number) => (
  pay: LimitCategory
): LimitCategory =>
  pay.id !== id
    ? pay
    : {
        ...pay,
        moneySpent:
          Math.round(pay.moneySpent) + Math.abs(Math.round(amount / 100)),
      };

export const categorize = (payments: MonoStatements): LimitCategory[] =>
  payments.reduce((accum, { mcc, amount }) => {
    return Math.sign(amount) === 1
      ? accum
      : accum.map(addAmount(getMccCategory(mcc), amount));
  }, getCategoriesTemplate(categories));
