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

export const defineCategory = (payments: MonoStatements) => {
  // It should return one category, not all of them
  // or rename it
  const initialCategories = getCategoriesTemplate(categories);
  return payments.reduce((accum, { mcc, description, amount }) => {
    const { category, id } = getMccCategory(mcc);
    console.log(id);

    const sobaka = initialCategories.findIndex((el) => el.categoryId === id);
    if (sobaka !== -1) {
      accum[sobaka] = {
        category,
        categoryId: id,
        description,
        amount: Math.abs(amount) / 100,
      };
    }
    return accum;
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
      const { category } = categories.find(({ id }) => +e === id) as Category;
      return {
        category,
        moneySpent: categoryObj[e],
        id: +e,
      };
    }
  );
};
