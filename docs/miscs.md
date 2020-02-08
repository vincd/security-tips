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


## Google API key
There is potential miss-configuration when an application uses the Google Maps API:

- Contain an HTTP Referrer with a `star` like `*example.com*/*`
- Use on other Google Cloud Platform Console (BigQuery, Compute Engine, ...)
- Return the `signature`parameter


The tool [`gmapsapiscanner`](https://github.com/ozguralp/gmapsapiscanner) can be
used to detect invalid permissions on Google Maps API.

