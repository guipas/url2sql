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

  it('select table with where clause', () => {
    const urlQueryBuilder = url2sql('/a?where=x.eq.1', knex);
    const queryBuilder = knex('a').where('x', '=', '1');

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with 2 where clause', () => {
    const urlQueryBuilder = url2sql('/a?where=x.eq.1&where=y.neq.2', knex);
    const queryBuilder = knex('a').where('x', '=', '1').where('y', '!=', '2');

    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with "in" where', () => {
    const urlQueryBuilder = url2sql('/a?where=x.in.1,2', knex);
    const queryBuilder = knex('a').where('x', 'in', ['1', '2']);

    console.log(urlQueryBuilder.toString())
    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with "not in" where', () => {
    const urlQueryBuilder = url2sql('/a?where=x.nin.1,2', knex);
    const queryBuilder = knex('a').where('x', 'not in', ['1', '2']);

    console.log(urlQueryBuilder.toString())
    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('select table with  multiple where clauses', () => {
    const urlQueryBuilder = url2sql('/a?where=x.nin.1,2&where=y.gt.3', knex);
    const queryBuilder = knex('a').where('x', 'not in', ['1', '2']).andWhere('y', '>', '3');

    console.log(urlQueryBuilder.toString())
    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('mixed operators 1', () => {
    const urlQueryBuilder = url2sql('/a?where=x.in.1,2&orderBy=z desc&limit=1', knex);
    const queryBuilder = knex('a').where('x', 'in', ['1', '2']).orderBy('z', 'desc').limit('1');

    console.log(urlQueryBuilder.toString())
    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

  it('complex where', () => {
    const urlQueryBuilder = url2sql(`/a?whereObject=${encodeURIComponent(`{ "or" : ["x.eq.1", "y.eq.2"]}`)}`, knex);
    const queryBuilder = knex('a').orWhere(function () {this.andWhere('x', '=', '1')}).orWhere(function(){this.andWhere('y', '=', '2')});

    console.log(urlQueryBuilder.toString())
    console.log(queryBuilder.toString())
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });

})