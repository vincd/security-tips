Nginx
=====

## Configuration file
Here is a miss-configuration in the the `nginx.conf` file:

```nginx
# static files
location /static {
    alias /srv/app/static/;
}
```

The location value does not end with a `/` but the alias value does. Which means that if we query: `https://example.com/static../foo` then the location will match and will concatenate `../foo` to the alias, which gives us this local file access: `/srv/app/static/../foo`


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
