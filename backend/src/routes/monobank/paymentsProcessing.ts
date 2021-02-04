import { categories } from "../../../mccCategories";
import { Category, Payment } from "../types/types";

const getMccCategory = (mccNumber: number): Category =>
    categories.find(({ mcc }) => mcc.numbers.includes(mccNumber)) || categories[15]; //add searching in ranges


export const spending = (payments: any[]): Payment[] => {
    const sortPayments = payments.filter(e => e.operationAmount < 0);
    return sortPayments.map(({ mcc, description, operationAmount, time }) => {
        const { category, id } = getMccCategory(mcc);
        return {
            time,
            category,
            categoryId: id,
            description,
            operationAmount,
        }
    })
}