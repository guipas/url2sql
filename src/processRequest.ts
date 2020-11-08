import * as Knex from 'knex';
import { buildWhereArray } from './buildWhereArray';
import { processUrlQuery }  from './processUrlQuery';

interface IRessourceQuery {
  table: string,
  id?: string,
  method: string,
  knex: Knex,
  body: any;
  query: {
    where?: string | string[];
    whereObject?: string;
    limit?: number | string;
    offset?: number | string;
    orderBy?: string;
  };
}


export const processRequest = ({ table, id, knex, query, body, method }: IRessourceQuery) => {

  if (!table) { throw 'no table prodvided' }
  if (!method) { throw 'no method provided' }

  const qb = knex(table);

  switch (method.toLocaleUpperCase()) {
    case 'GET':
      if (id) { qb.where('id', '=', id) }
      return processUrlQuery(qb, query);
    case 'DELETE':
      return qb.where('id', '=', id).delete();
    case 'PUT':
      return qb.where('id', '=', id).update(body);
    case 'POST':
      return qb.insert(body);
    default:
      throw 'Unkown method';
  }
}