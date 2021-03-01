/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type ClientStorage from '../types/ClientStorage';

const version = 2.4;
const storeName = 'items';

type IDBUpgradeEvent = IDBVersionChangeEvent & {
  currentTarget: { result: IDBDatabase };
};

interface UpgradeCallback {
  (resolve: (db: IDBDatabase) => void): (event: IDBUpgradeEvent) => void;
}

const requestWrapper = <T>(
  request: IDBRequest<T>
): Promise<IDBRequest<T>['result']> => {
  return new Promise((resolve, reject) => {
    request.onerror = reject;
    request.onsuccess = () => resolve(request.result);
  });
};

const openDB = (
  name: string,
  onupgradeneeded?: UpgradeCallback
): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version);
    request.onerror = reject;
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onupgradeneeded = onupgradeneeded && onupgradeneeded(resolve);
  });

export default class IndexedDBStorage<Item extends { [k in string]: any }>
  implements ClientStorage<Item, Extract<keyof Item, string>> {
  private _dataSource: IDBDatabase;

  private constructor(dataSource: IDBDatabase) {
    this._dataSource = dataSource;
  }

  static async newInstance<Item extends { [k in string]: any }>(
    name: string,
    key: Extract<keyof Item, string>
  ): Promise<ClientStorage> {
    const upgradeCallback: UpgradeCallback = (resolve) => (event) => {
      event.currentTarget.result.createObjectStore(storeName, {
        keyPath: key,
      });
      openDB(name).then(resolve);
    };
    const dataSource = await openDB(name, upgradeCallback);
    return new IndexedDBStorage(dataSource);
  }

  private async objectStoreTranasaction<T>(
    objectStoreRequest: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<IDBRequest<T>['result']> {
    const store = this._dataSource
      .transaction([storeName], 'readwrite')
      .objectStore(storeName);

    return requestWrapper(objectStoreRequest(store));
  }

  async clear(): Promise<void> {
    await this.objectStoreTranasaction((store) => store.clear());
  }

  async getItem<Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ): Promise<Item | null> {
    return this.objectStoreTranasaction((store) => store.get(key)) || null;
  }

  async putItem(item: Item): Promise<void> {
    await this.objectStoreTranasaction((store) => store.put(item));
  }

  async deleteItem<Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ): Promise<void> {
    await this.objectStoreTranasaction((store) => store.delete(key));
  }

  async getAll(): Promise<Item[]> {
    return this.objectStoreTranasaction((store) => store.getAll());
  }
}
