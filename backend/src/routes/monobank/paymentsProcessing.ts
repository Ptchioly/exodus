import { categories } from '../../../mccCategories';
import { isInRange } from '../../utils';
import {
  Category,
  LimitCategory,
  MonoStatements,
  Payment,
} from '../types/types';

const other = 15;

const getMccCategory = (mccNumber: number): Category =>
  categories.find(
    ({ mcc }) =>
      mcc.numbers.includes(mccNumber) || isInRange(mcc.ranges, mccNumber)
  ) || categories[other];

const defineCategory = (payments: MonoStatements): Payment[] => {
  const spending = payments.filter((e) => e.operationAmount < 0);
  return spending.map(({ mcc, description, amount, time }) => {
    const { category, id } = getMccCategory(mcc);
    return {
      time,
      category,
      categoryId: id,
      description,
      amount: Math.abs(amount) / 100,
    };
  });
};

export const categorize = (payments: MonoStatements): LimitCategory[] => {
  const categoryObj = defineCategory(payments).reduce(
    (acc: any, { categoryId, amount }) => {
      const rounded = Math.floor(amount);
      if (acc[categoryId] === undefined) acc[categoryId] = rounded;
      else acc[categoryId] = acc[categoryId] + rounded;

      return acc;
    },
    {}
  );

  return Object.keys(categoryObj).map(
    (e): LimitCategory => {
      const { category } = categories.find(({ id }) => +e === id) as Category;
      return {
        category,
        moneySpent: categoryObj[e],
        id: +e,
      };
    }
  );
};
