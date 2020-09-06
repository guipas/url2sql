const url2sql = require('../dist/index').url2sql;
const Knex = require('knex');
const knex = Knex({ client : 'sqlite3' });
const expect = require('expect.js');

describe('Post operations', function () {

  it('insert in table', () => {
    const urlQueryBuilder = url2sql('/a', knex, 'POST', { x : 2 });
    const queryBuilder = knex('a').insert({ x : 2 });

    console.log(queryBuilder.toString());
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });
  
  it('fails when trying to post on an id', () => {
    try {
      url2sql('/a/b', knex, 'POST', { x : 2 });
      expect(1).to.equal(0);
    } catch (e) {
    }
  });
  
})