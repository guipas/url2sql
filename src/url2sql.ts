import * as Knex from "knex";
import { processRequest } from "./processRequest";
import { logger } from "./utils/logger";

export const url2sql = (urlString: string, knex: Knex, method = 'GET', body = {}): Knex.QueryBuilder => {
  
  const url = new URL(urlString, 'http://localhost');
  const regexp = new RegExp(`^\/?([^\/]+)(?:\/([^\/]+))?$`, 'g');
  const result = regexp.exec(url.pathname);

  logger('regexp results', result);

  const table = result[1]?.split?.('.')?.pop();
  const id = result[2];

  return processRequest({
    table,
    id,
    method,
    knex,
    body,
    query: {
      where: url.searchParams.getAll('where'),
      whereObject: url.searchParams.get('whereObject'),
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
      orderBy: url.searchParams.get('orderBy'),
    }
  });

}