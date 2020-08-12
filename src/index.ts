import Knex from 'knex';
import { URL } from 'url'

export const url2sql = (urlString: string, knex: Knex, method = 'GET', body = {}): Knex.QueryBuilder => {
  const url = new URL(urlString, 'http://localhost');
  const regexp = new RegExp(`^\/?([^\/])+(?:\/([^\/]+))?$`, 'g');
  // console.log(url);

  const result = regexp.exec(url.pathname)
  // console.log(result);

  const table = result[1];
  const id = result[2];

  if (table && method === 'GET' ){
      console.log('search params: ', url.searchParams)
      console.log('search params keys:', url.searchParams.keys());
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