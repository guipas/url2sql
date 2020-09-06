const url2sql = require('../dist/index').url2sql;
const Knex = require('knex');
const knex = Knex({ client : 'sqlite3' });
const expect = require('expect.js');

describe('get operations', function () {

  it('select table', () => {
    const urlQueryBuilder = url2sql('/a', knex);
    const queryBuilder = knex('a');

    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table row', () => {
    const urlQueryBuilder = url2sql('/a/b', knex);
    const queryBuilder = knex('a').where('id', 'b');

    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table does not care about random query params', () => {
    const urlQueryBuilder = url2sql('/a?x=p', knex);
    const queryBuilder = knex('a');

    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with limit', () => {
    const urlQueryBuilder = url2sql('/a?limit=1', knex);
    const queryBuilder = knex('a').limit(1);

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with offset', () => {
    const urlQueryBuilder = url2sql('/a?offset=1', knex);
    const queryBuilder = knex('a').offset(1);

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with offset and limit', () => {
    const urlQueryBuilder = url2sql('/a?offset=1&limit=1', knex);
    const queryBuilder = knex('a').offset(1).limit(1);

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with orderBy', () => {
    const urlQueryBuilder = url2sql('/a?orderBy=z', knex);
    const queryBuilder = knex('a').orderBy('z');

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with orderBy desc', () => {
    const urlQueryBuilder = url2sql('/a?orderBy=z desc', knex);
    const queryBuilder = knex('a').orderBy('z', 'desc');

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

})