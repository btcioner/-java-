登陆数据库
```
psql -U postgres

```

创建用户
```
create user sms with login password 'passwd'; 
```
创建SCHEMA
```
CREATE SCHEMA myschema;
```
给某用户赋权SCHEMA
 ```
 grant all on all tables in schema schemaName to user;
 ```
