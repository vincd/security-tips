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


## Nmap

```bash
nmap -sC -sV -oA <output_name> <host>
```


## Google API key
There is potential miss-configuration when an application uses the Google Maps API:

- Contain an HTTP Referrer with a `star` like `*example.com*/*`
- Use on other Google Cloud Platform Console (BigQuery, Compute Engine, ...)
- Return the `signature`parameter


The tool [`gmapsapiscanner`](https://github.com/ozguralp/gmapsapiscanner) can be
used to detect invalid permissions on Google Maps API.


## Github dorking

Search a PoC for a CVE on Github:

```
https://github.com/search?q="<CVE-ID>"+AND+exploit+in:name+in:description+in:readme
```


## Default passwords

The website [cirt.net](https://cirt.net/passwords?vendor=) lists the default
passwords on equipments or applications.


## Download recursively an Apache Directory Listing

```bash
wget -r -N --no-parent --reject '*index.html*' -nH --cut-dirs=1  <url>
```
