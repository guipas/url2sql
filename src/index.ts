import * as Knex from 'knex';
import { URL } from 'url';
import { Request, Response, NextFunction } from 'express';

const logger = (...args: any[]): any => process.env.DEBUG ? console.log(...args) : null;

interface IRessourceQuery {
  table: string,
  id?: string,
  method: string,
  knex: Knex,
  body: any;
  modifiers: {
    where?: string[];
    limit?: string;
    offset?: string;
    orderBy?: string;
  };
}

export const buildQuery = ({ table, id, knex, modifiers: queryParams, body, method }: IRessourceQuery) => {

  if (!table) { throw 'no table prodvided' }
  if (!method) { throw 'no method provided' }

  method = method.toLocaleUpperCase();

  if (!['GET', 'PUT', 'POST', 'DELETE'].includes(method)) { throw 'Unkown method'; }

  if (method === 'GET' ){
      const where: Record<string, any> = {};

      if (id) {  where.id = id; }

      const qb = knex(table).where(where);

      if(queryParams.where) {
        const wheres: string[] = queryParams.where;
        for (const where of wheres) {
          const parsedWhere = where.split(`.`);
          if (parsedWhere.length !== 3) { throw `Wrong number of argument for "${where}" where clause, expect 3, got ${parsedWhere.length}`; }
          const column = parsedWhere[0];
          const operatorsMap: Record<string, string> = {
            eq: '=',
            neq: '!=',
            in: 'in',
            nin: 'not in',
            lt: '<',
            gt: '>',
            lte: '<=',
            gte: '>=',
            like: 'like',
          };
          const operator = operatorsMap[parsedWhere[1]];
          const value = (operator === operatorsMap.in || operator === operatorsMap.nin) ? parsedWhere[2].split(',') : parsedWhere[2];
          qb.where(column, operator, value);
        }
      }
      
      if (queryParams.limit) {
        qb.limit(parseInt(queryParams.limit, 10));
      }
      
      if (queryParams.offset) {
        qb.offset(parseInt(queryParams.offset, 10));
      }
      
      if (queryParams.orderBy) {
        const orderByStr = queryParams.orderBy;
        const orderBySplit = orderByStr.split(' ');
        const orderByValue = orderBySplit[0];
        const orderByDir = orderBySplit[1] === 'desc' ? 'desc' : 'asc';
        qb.orderBy(orderByValue, orderByDir);
      }

      return qb;
  } else if (!id && method === 'POST') {
    return knex(table).insert(body);
  } else if (id && method === 'PUT') {
    return knex(table).where('id', id).update(body);
  } else if (id  && method === 'DELETE') {
    return knex(table).where('id', id).delete();
  }

  throw new Error();
}

export const url2sql = (urlString: string, knex: Knex, method = 'GET', body = {}): Knex.QueryBuilder => {
  
  const url = new URL(urlString, 'http://localhost');
  const regexp = new RegExp(`^\/?([^\/]+)(?:\/([^\/]+))?$`, 'g');
  const result = regexp.exec(url.pathname);

  logger('regexp results', result);

  const table = result[1]?.split?.('.')?.pop();
  const id = result[2];

  return buildQuery({
    table,
    id,
    method,
    knex,
    body,
    modifiers: {
      where: url.searchParams.getAll('where'),
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
      orderBy: url.searchParams.get('orderBy'),
    }
  })

}

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