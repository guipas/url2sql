import Knex from 'knex';
import { URL } from 'url';
import { Request, Response, NextFunction } from 'express';

const logger = (...args: any[]): any => process.env.DEBUG ? logger(...args) : null;

export const url2sql = (urlString: string, knex: Knex, method = 'GET', body = {}): Knex.QueryBuilder => {
  const url = new URL(urlString, 'http://localhost');
  const regexp = new RegExp(`^\/?([^\/]+)(?:\/([^\/]+))?$`, 'g');

  const result = regexp.exec(url.pathname);

  logger('regexp results', result);

  const table = result[1];
  const id = result[2];

  if (table && method === 'GET' ){
      logger('search params: ', url.searchParams)
      logger('search params keys:', url.searchParams.keys());
      const where: Record<string, any> = {};

      if (id) {
        where.id = id;
      }

      const qb = knex(table).where(where);
      
      if (url.searchParams.get('limit')) {
        qb.limit(parseInt(url.searchParams.get('limit'), 10));
      }
      
      if (url.searchParams.get('offset')) {
        qb.offset(parseInt(url.searchParams.get('offset'), 10));
      }
      
      if (url.searchParams.get('orderBy')) {
        const orderByStr = url.searchParams.get('orderBy');
        const orderBySplit = orderByStr.split(' ');
        const orderByValue = orderBySplit[0];
        const orderByDir = orderBySplit[1] === 'desc' ? 'desc' : 'asc';
        qb.orderBy(orderByValue, orderByDir);
      }

      return qb;
  } else if (table && !id && method === 'POST') {
    const qb = knex(table).insert(body);

    return qb;
  } else if (table && id && method === 'PUT') {
    const qb = knex(table).where('id', id).update(body);

    return qb;
  } else if (table && id  && method === 'DELETE') {
    const qb = knex(table).where('id', id).delete();

    return qb;
  }


  throw new Error();
}

export const middleware = (knex: Knex) => async (req: Request, res: Response, next: NextFunction) => {
  logger('in middleware !', req.url);
  try {
    const result = await url2sql(req.url, knex, req.method, req.body);
    logger('results: ', result);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}