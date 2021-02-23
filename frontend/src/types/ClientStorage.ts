export default interface ClientStorage<Item> {
  getItem: <Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ) => Promise<Item>;
  putItem: (item: Item) => Promise<void>;
  deleteItem: <Key extends Extract<keyof Item, string>>(
    key: Item[Key]
  ) => Promise<void>;
}
