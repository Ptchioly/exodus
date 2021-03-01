import type ClientStorage from '../types/ClientStorage';
import type { UserMeta } from '../types/ClientStorage';
import IndexedDBStorage from './IndexDBStorage';

type StorageTypes = 'Accounts';

const storages: Record<
  StorageTypes,
  <T, K extends Extract<keyof T, string>>() => Promise<ClientStorage<T, K>>
> = {
  Accounts: () => IndexedDBStorage.newInstance<UserMeta>('userMeta', 'name'),
};

export default storages;
