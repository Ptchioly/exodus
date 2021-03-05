import { updateLimit } from '../endpointApi';

interface Request {
  (): Promise<any>;
}
type Hash = string;

type RequestPull = Record<Hash, { request: Request; timeout: NodeJS.Timeout }>;

const hashLimit = (accountId: string, categotyId: number): string =>
  `${accountId}-${categotyId}`;

export default class LimitHandler {
  _requests: RequestPull = {};
  _delay: number;

  constructor(delay: number) {
    this._delay = delay;
  }

  public push(limit: number, categoryId: number, accountId: string): void {
    const request: Request = () => updateLimit(categoryId, limit, accountId);
    const timeout = setTimeout(request, this._delay);
    const hash = hashLimit(accountId, categoryId);
    if (this._requests[hash]) clearTimeout(this._requests[hash].timeout);

    this._requests[hash] = { request, timeout };
  }

  public async force(): Promise<void> {
    await Promise.all(
      Object.values(this._requests).map(({ timeout, request }) => {
        clearTimeout(timeout);
        return request();
      })
    );
    this._requests = {};
  }
}
