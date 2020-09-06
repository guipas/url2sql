const Knex = require('knex');
const expect = require('expect.js');
const Axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('../dist/index').middleware;

const knex = Knex({ 
  client : 'sqlite3',
  connection: {
    filename: "./tests.sqlite"
  }
});
const port = process.env.PORT || 3005;
const axios = Axios.create({
  baseUrl: `http://localhost:${port}`,
})

describe('middleware', function () {

  it('simple query on middleware', async () => {

    await knex.schema.dropTableIfExists('users');
    await knex.schema.createTable('users', table => {
      table.increments('id');
      table.string('name');
    });

    await knex('users').insert({ name : 'user1' });
    
    const app = express();
    app.use(bodyParser.json());
    app.use(middleware(knex));

    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        console.log(`Test app listening at http://localhost:${port}`);
  
        axios.get(`http://localhost:${port}/users`)
          .then(res => {
            expect(res.data).to.exist;
            expect(res.data).to.be.an('array');
            expect(res.data.length).to.equal(1);
          })
          .then(resolve)
          .catch(reject)
      })
    })

  });
  
})