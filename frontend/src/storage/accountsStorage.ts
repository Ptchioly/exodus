import type { Account } from '../types/Api';
import type ClientStorage from '../types/ClientStorage';
import IndexedDBStorage from './IndexDBStorage';

export const accountsStorage = async (): Promise<
  ClientStorage<Account, 'id'>
> => {
  const storage = new IndexedDBStorage<Account>('users', 'id');
  await storage.init();
  return storage;
};
