import type { Account } from './Api';

export default interface ClientStorage<
  Item,
  Key extends Extract<keyof Item, string>
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
