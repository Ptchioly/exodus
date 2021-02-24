/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type ClientStorage from '../types/ClientStorage';

const version = 2.4;
const notInitializedError: Error = {
  name: 'DBNotInitialized',
  message: 'indexed db was not initialized',
};

export default class IndexedDBStorage<
  Item extends { [k in string]: any }
  //   Key extends Extract<keyof Item, string>
> implements ClientStorage<Item, Extract<keyof Item, string>> {
  private _name: string;
  private _keys: Extract<keyof Item, string>;
  private _factory: IDBFactory;
  private _dataSource?: IDBDatabase;
  private _storeName = 'items';

  constructor(name: string, key: Extract<keyof Item, string>) {
    this._keys = key;
    this._name = name;
    this._factory = window.indexedDB;
  }
  async clear(): Promise<void> {
    if (!this._dataSource) return Promise.reject(notInitializedError);
    return new Promise((resolve, reject) => {
      const request = this._dataSource
        .transaction([this._storeName], 'readwrite')
        .objectStore(this._storeName)
        .clear();
      request.onerror = reject;
      request.onsuccess = () => resolve();
    });
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this._factory.open(this._name, version);
      request.onerror = reject;
      request.onsuccess = () => {
        this._dataSource = request.result;
        resolve();
      };
      request.onupgradeneeded = async (
        e: IDBVersionChangeEvent & { currentTarget: { result: IDBDatabase } }
      ) => {
        // Если БД еще не существует, то создаем хранилище объектов.
        e.currentTarget.result.createObjectStore(this._storeName, {
          keyPath: this._keys,
        });
        await this.init();
      };
    });
  }

  getItem<Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ): Promise<Item | null> {
    if (!this._dataSource) return Promise.reject(notInitializedError);
    return new Promise((resolve, reject) => {
      const request = this._dataSource
        .transaction([this._storeName], 'readonly')
        .objectStore(this._storeName)
        .get(key);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result ? request.result : null);
    });
  }

  putItem(item: Item): Promise<void> {
    if (!this._dataSource) return Promise.reject(notInitializedError);
    return new Promise((resolve, reject) => {
      const request = this._dataSource
        .transaction([this._storeName], 'readwrite')
        .objectStore(this._storeName)
        .put(item);
      request.onerror = reject;
      request.onsuccess = () => resolve();
    });
  }

  deleteItem<Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ): Promise<void> {
    if (!this._dataSource) return Promise.reject(notInitializedError);
    return new Promise((resolve, reject) => {
      const request = this._dataSource
        .transaction([this._storeName], 'readwrite')
        .objectStore(this._storeName)
        .delete(key);
      request.onerror = reject;
      request.onsuccess = () => resolve();
    });
  }

  getAll(): Promise<Item[]> {
    if (!this._dataSource) return Promise.reject(notInitializedError);
    return new Promise((resolve, reject) => {
      const request = this._dataSource
        .transaction([this._storeName], 'readwrite')
        .objectStore(this._storeName)
        .getAll();

      request.onerror = reject;
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}
