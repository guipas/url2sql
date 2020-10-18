
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

// transform a "where" clause from the url format to knex format
// e.g. from "e.eq.2" to ['x', '=', '2']
export const buildWhereArray = (whereString: string): [string, string, string | string[]] => {
  const parsedWhere = whereString.split(`.`);
  if (parsedWhere.length !== 3) { throw `Wrong number of argument for "${whereString}" where clause, expect 3, got ${parsedWhere.length}`; }
  const column = parsedWhere[0];
  
  const operator = operatorsMap[parsedWhere[1]];
  const value = (operator === operatorsMap.in || operator === operatorsMap.nin) ? parsedWhere[2].split(',') : parsedWhere[2];

  return [column, operator, value];
}