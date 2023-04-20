import { NextApiRequest, NextApiResponse } from 'next';

import { errorHandler } from './error-handler';

export type MyHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse<any>>;
export type ApiWrapper = (handler: MyHandler) => MyHandler;

export class NextApiBuilder {
  handler: MyHandler;
  wrappers: ApiWrapper[];

  constructor(handler: MyHandler) {
    this.handler = handler;
    this.wrappers = [errorHandler];
  }

  add(wp: ApiWrapper) {
    if (!this.wrappers.includes(wp)) {
      this.wrappers.push(wp);
    }

    return this;
  }

  build(): MyHandler {
    let handler = this.handler;

    for (const c of this.wrappers.reverse()) {
      handler = c(handler);
    }

    return handler;
  }
}
