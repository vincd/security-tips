---
title: "HTTP"
description: "Common misconfiguration on HTTP servers and applications"
date: 15/12/2020
categories:
 - HTTP
tags:
 - HTTP
 - header
 - web
---


## Headers

### HTTP method override

The headers `X-HTTP-Method`, `X-HTTP-Method-Override` or `X-Method-Override` are
used to override the real HTTP method on request.
The reverse proxy may check the real method and passes the request to the
application which uses the header value as method.

```
GET / HTTP/1.1
Host: ...
X-HTTP-Method: TRACE
...
```


### HTTP path override

The headers `X-Original-URL` or `X-Rewrite-URL` may be supported by applications
in order to override the requested path in the request.
The reverse proxy may check the real path and passes the request to the
application which uses the header value as a path.

```
GET / HTTP/1.1
Host: ...
X-Original-URL: /admin
...
```


### Bypass user IP restriction

The following headers can be used to override the IP address of the user to
bypass some restrictions based on the user IP.

```
X-Forwarded-For
X-Forward-For
X-Remote-IP
X-Originating-IP
X-Remote-Addr
X-Client-IP
```


### Max forward

The `Max-Forwards` header provides a mechanism to limit the number of times that
the request is forwarded by proxies. This can be useful when the client is
attempting to trace a request that appears to be failing or looping mid-chain
(cf [section-5.1.2](https://tools.ietf.org/html/rfc7231#section-5.1.2)).

```
GET / HTTP/1.1
Host: ...
Max-Forwards: 2
...
```
