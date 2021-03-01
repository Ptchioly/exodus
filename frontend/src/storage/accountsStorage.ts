import type ClientStorage from '../types/ClientStorage';
import type { UserMeta } from '../types/ClientStorage';
import IndexedDBStorage from './IndexDBStorage';

export const AccountsStorage = async (): Promise<
  ClientStorage<UserMeta, 'name'>
> => {
  const storage = new IndexedDBStorage<UserMeta>('userMeta', 'name');
  await storage.init();
  return storage;
};
