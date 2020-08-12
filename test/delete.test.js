const url2sql = require('../dist/index').url2sql;
const Knex = require('knex');
const knex = Knex({ client : 'sqlite3' });
const expect = require('expect.js');

describe('Delete operations', function () {

  it('delete in table', () => {
    const urlQueryBuilder = url2sql('/a/b', knex, 'DELETE');
    const queryBuilder = knex('a').where('id', 'b').delete();

    console.log(queryBuilder.toString());
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });
  
  it('fails when trying to delete without an id', () => {
    try {
      url2sql('/a', knex, 'DELETE');
      expect(1).to.equal(0);
    } catch (e) {
    }
  });
  
})