import { NextFunction, Response, Request } from "express";
import * as Knex from "knex";
import { processRequest } from "./processRequest";
import { logger } from "./utils/logger";

interface IMiddlewareOptions {
  tableParamName?: string;
  idParamName?: string;
}

export const middleware = (knex: Knex, options?: IMiddlewareOptions) => async (req: Request, res: Response, next: NextFunction) => {
  logger('Enter url2Sql middleware', req.url);
  try {
    const result = await processRequest({
      table: req.params[options?.tableParamName || 'table'],
      id: req.params[options?.idParamName || 'id'],
      method: req.method,
      knex,
      body: req.body,
      query: req.query,
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}