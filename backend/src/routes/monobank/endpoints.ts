export const endpoint = (path: string): string =>
  `https://api.monobank.ua/${path}`;

export const requests = {
  statement: (account: 0 | string, from: number, to?: number): string =>
    endpoint(`personal/statement/${account}/${from}/${to}`),
  personal: (): string => endpoint('personal/client-info'),
};
