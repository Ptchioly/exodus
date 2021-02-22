import { categories } from '../../../mccCategories';
import { isInRange } from '../../utils';
import {
  Category,
  LimitCategory,
  MonoStatements,
  Payment,
} from '../types/types';

const other = 15;

export const getMccCategory = (mccNumber: number): Category =>
  categories.find(
    ({ mcc }) =>
      mcc.numbers.includes(mccNumber) || isInRange(mcc.ranges, mccNumber)
  ) || categories[other];

const getCategoriesTemplate = (categories: Category[]): Payment[] => {
  return categories.map((category) => {
    return {
      category: category.category,
      categoryId: category.id,
      description: category.category,
      amount: 0,
    };
  });
};

export const defineCategory = (payments: MonoStatements): Payment[] => {
  const initialCategories = getCategoriesTemplate(categories);
  return payments.reduce((accum, { mcc, amount }) => {
    const { id } = getMccCategory(mcc);
    if (Math.sign(amount) === 1) return accum;
    return accum.map((pay) => {
      if (pay.categoryId !== id) return pay;
      return {
        ...pay,
        amount: pay.amount + Math.abs(amount / 100),
      };
    });
  }, initialCategories);
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
      const { category } = categories.find(({ id }) => +e === id)!;
      return {
        category,
        moneySpent: categoryObj[e],
        id: +e,
      };
    }
  );
};
