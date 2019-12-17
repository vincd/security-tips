Miscellaneous
============

## Web
### Serve a file locally

```bash
$ while :; do (echo -ne "HTTP/1.1 200 OK\r\nContent-Length: $(wc -c < index.html)\r\n\r\n"; cat index.html) | nc -l -p 8080; done
```

## SSL/TLS

### SSL configuration examples

[Mozilla Config](https://ssl-config.mozilla.org/)
