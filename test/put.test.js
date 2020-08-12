const url2sql = require('../dist/index').url2sql;
const Knex = require('knex');
const knex = Knex({ client : 'sqlite3' });
const expect = require('expect.js');

console.log(url2sql);

describe('Post operations', function () {

  it('update in table', () => {
    const urlQueryBuilder = url2sql('/a/b', knex, 'PUT', { x : 2 });
    const queryBuilder = knex('a').where('id', 'b').update({ x : 2 });

    console.log(queryBuilder.toString());
    expect(urlQueryBuilder.toString()).to.equal(queryBuilder.toString());
  });
  
  it('fails when trying to update without an id', () => {
    try {
      url2sql('/a', knex, 'PUT', { x : 2 });
      expect(1).to.equal(0);
    } catch (e) {
    }
  });
  
})