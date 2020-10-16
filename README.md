WIP: A very simple function and express middleware that help you form SQL queries from an URL. Based on [Knex](http://knexjs.org/).

```
npm i url2sql
```

Note: the provided middleware does *not* include a security mechanism (i.e. we don't check if the user *can* query the table/database, we just execute the query), you will have to implement that part yourself in another middleware.

Also, this library's intent is not to provide a full-fledged way to query the database from an url, but rather to provide a way to execute simple GET/POST/PUT/DELETE operation on a database. You wont be able to use it to build complex SQL queries from a url, only simple ones.

**Here are some examples of what it can do:**

| URL | SQL |
|-----|-----|
| `/users` | `SELECT * FROM users` |
| `/users?offset=10&limit=20&orderBy=age` | `SELECT * FROM users OFFSET 10 LIMIT 20 ORDER BY age` |
| `/users?where=id.eq.1` | `SELECT * FROM users WHERE id = '1'` |
| `/users?where=age.gte.21&where=job.eq.astronaut` | `SELECT * FROM users WHERE age >= '21' AND job = 'astronaut'` |
| -- (joins are not implemented) | `SELECT * FROM users JOIN article on users.id = article.author` |
| -- ("or" in where clause not implemented) | `SELECT * FROM users where age = '21' OR age = '22'` |

**Middleware Usage example**

```ts
import { middleware as url2sql } from 'url2sql';

router.all(
  `/:ressource/:ressourceId?`,
  // here, put some middleware to check user authentication and rights
  url2sql(knexInstance), // the middleware will treat the first parameter it receives (here :ressouce) as the table name and the second as the (optionnal) id.
);
```