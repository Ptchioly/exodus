import type { Account } from './Api';

export default interface ClientStorage<
  Item = any,
  Key extends Extract<keyof Item, string> = any
> {
  getItem: (key: Item[Key]) => Promise<Item>;
  putItem: (item: Item) => Promise<void>;
  deleteItem: (key: Item[Key]) => Promise<void>;
  getAll: () => Promise<Item[]>;
  clear: () => Promise<void>;
}

export type UserMeta = {
  name: string;
  accounts: Account[];
};
