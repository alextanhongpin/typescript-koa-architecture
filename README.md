# typescript-koa-microservice

Sample microservice architecture using TypeScript and Koa.js.

## MySQL 8.0.4

Any version above 8.0.3 will encounter this issue, and nodejs mysql library will throw error (as of 18th June 2018). Revert back to 8.0.3 first.

https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-4.html
```json
{ Error: Client does not support authentication protocol requested by server; consider upgrading MySQL client
  message: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  errno: 1251,
  sqlState: '08004',
  sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client' }
```

## Create basic table

```bash
mysql > create table users (name TEXT);
```