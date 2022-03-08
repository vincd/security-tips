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
X-HTTP-Method-Override: TRACE
X-Method-Override: TRACE
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
X-Rewrite-URL: /admin
...
```


### Bypass user IP restriction

The following headers can be used to override the IP address of the user to
bypass some restrictions based on the user IP.

```
X-Forwarded-For
X-Forward-For
X-Real-IP
X-Remote-IP
X-Originating-IP
X-Remote-Addr
X-Client-IP
```

Also, keep in mind a web server may handle headers as case sensitive, so you
can send multiple variants of the same header with spaces and different cases:

```
x-real-ip
 x-real-ip
X-rEal-Ip
```

You may need to make this test multiple times.

**Sources**:

- [Practical HTTP Header Smuggling: Sneaking Past Reverse Proxies to Attack AWS and Beyond](https://www.intruder.io/research/practical-http-header-smuggling)
- [LiveOverflow - Finding 0day in Apache APISIX During CTF (CVE-2022-24112)](https://www.youtube.com/watch?v=yrCXamnX9No&t=583)
- [apache/apisix fix real-ip header bypass](https://github.com/apache/apisix/commit/48e8a1ee483caa7150f7ad812953730eb50324bb)


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


## Cache

[Cache-Key Normalization](https://iustin24.github.io/Cache-Key-Normalization-Denial-of-Service/)
