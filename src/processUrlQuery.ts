import * as Knex from 'knex';
import { QueryBuilder } from 'knex';
import { processWhere } from './processWhere';

export const processUrlQuery = (queryBuilder: Knex.QueryBuilder, query: Record<string, any>) => {

  if (query.whereObject) {
    const parsedWhereObject = JSON.parse(decodeURIComponent(query.whereObject));
    processWhere(queryBuilder, parsedWhereObject);
  }

  if (query.where) {
    processWhere(queryBuilder, query.where);
  }
  
  if (query.limit) {
    queryBuilder.limit(parseInt(`${query.limit}`, 10));
  }
  
  if (query.offset) {
    queryBuilder.offset(parseInt(`${query.offset}`, 10));
  }
  
  if (query.orderBy) {
    const orderByStr = query.orderBy;
    const orderBySplit = orderByStr.split(' ');
    const orderByValue = orderBySplit[0];
    const orderByDir = orderBySplit[1] === 'desc' ? 'desc' : 'asc';
    queryBuilder.orderBy(orderByValue, orderByDir);
  }

  return queryBuilder;
}

