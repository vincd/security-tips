
# Nginx

## Configuration file
Here is a miss-configuration in the the nginx.conf file:

```
# static files
location /static {
    alias /srv/app/static/;
}
```

The location value does not end with a `/` but the alias value does. Which means that if we query: `https://example.com/static../foo` then the location will match and will concatenate `../foo` to the alias, which gives us this local file access: `/srv/app/static/../foo`
