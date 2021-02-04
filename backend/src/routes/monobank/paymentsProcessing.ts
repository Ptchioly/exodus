import { categories } from '../../../mccCategories';
import { isInRange } from '../../utils';
import { Category, LimitCategory, Payment } from '../types/types';

const getMccCategory = (mccNumber: number): Category =>
  categories.find(
    ({ mcc }) =>
      mcc.numbers.includes(mccNumber) || isInRange(mcc.ranges, mccNumber)
  ) || categories[15];

const defineCategory = (payments: any[]): Payment[] => {
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

export const categorize = (payments: any[]): LimitCategory[] => {
  const categoryObj = defineCategory(payments).reduce(
    (acc: any, { categoryId, amount }) => {
      if (acc[categoryId] === undefined) acc[categoryId] = amount;
      else acc[categoryId] = acc[categoryId] + amount;

      return acc;
    },
    {}
  );

  return Object.keys(categoryObj).map(
    (e): LimitCategory => {
      const catId = parseInt(e);
      const { category } = categories.find(({ id }) => catId === id)!;
      return {
        name: category,
        currMonth: categoryObj[e],
        prevMonth: 0,
        limit: 0,
        id: catId,
      };
    }
  );
};
