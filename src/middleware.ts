import { NextFunction, Response, Request } from "express";
import Knex from "knex";
import { url2sql } from "./url2sql";
import { logger } from "./utils/logger";


export const middleware = (knex: Knex) => async (req: Request, res: Response, next: NextFunction) => {
  logger('Enter url2Sql middleware', req.url);
  try {
    const result = await url2sql(req.url, knex, req.method, req.body);
    logger('results: ', result);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}