import * as Knex from 'knex';
import { QueryBuilder } from 'knex';
import { buildWhereArray } from './buildWhereArray';

export type Where = string | string[] | {
  or?: Where[];
  and?: Where[];
}


export function processWhere(queryBuilder: QueryBuilder, where: Where): QueryBuilder {
  // console.log('processWhere', where);
  if (typeof where === 'string') {
    return queryBuilder.andWhere(...buildWhereArray(where))
  }
  if (Array.isArray(where)) {
    return andWhere(queryBuilder, where);
  } else if (where.or) {
    return orWhere(queryBuilder, where.or);
  } else if (where.and) {
    return andWhere(queryBuilder, where.and);
  }

  return queryBuilder;
}

function orWhere (queryBuilder: QueryBuilder, where: Where[]): QueryBuilder {
  // console.log('orwhere', where);
  for (const w of where) {
    queryBuilder = queryBuilder.orWhere(function () {
      processWhere(this, w)
    })
  }

  return queryBuilder;
}

function andWhere (queryBuilder: QueryBuilder, where: Where[]): QueryBuilder {
  // console.log('andwhere', where);
  for (const w of where) {
    if (typeof w === 'string') { queryBuilder.andWhere(...buildWhereArray(w)); continue; }
    queryBuilder = queryBuilder.andWhere(function () {
        processWhere(this, w)
    })
  }

  return queryBuilder;
}