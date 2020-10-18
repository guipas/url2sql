import * as Knex from 'knex';

interface IRessourceQuery {
  table: string,
  id?: string,
  method: string,
  knex: Knex,
  body: any;
  modifiers: {
    where?: [string, string, string | string[]][];//[ ['id' 'in', ['1', '2' , '3']] ]
    limit?: number | string;
    offset?: number | string;
    orderBy?: string;
  };
}

export const buildQuery = ({ table, id, knex, modifiers, body, method }: IRessourceQuery) => {

  if (!table) { throw 'no table prodvided' }
  if (!method) { throw 'no method provided' }

  method = method.toLocaleUpperCase();

  if (!['GET', 'PUT', 'POST', 'DELETE'].includes(method)) { throw 'Unkown method'; }

  if (method === 'GET' ){
      const where: Record<string, any> = {};

      if (id) {  where.id = id; }

      const qb = knex(table).where(where);

      if(modifiers.where) {
        for (const where of modifiers.where) {
          if (where.length !== 3) { throw `Wrong number of argument for "${where}" where clause, expect 3, got ${where.length}`; }
          qb.where(...where);
        }
      }
      
      if (modifiers.limit) {
        qb.limit(parseInt(`${modifiers.limit}`, 10));
      }
      
      if (modifiers.offset) {
        qb.offset(parseInt(`${modifiers.offset}`, 10));
      }
      
      if (modifiers.orderBy) {
        const orderByStr = modifiers.orderBy;
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