Miscellaneous
============

## SSL/TLS

### SSL configuration examples

Mozilla provides a tool to [generate configuration](https://ssl-config.mozilla.org/)
files for various technologies of servers (web, SQL, ...).


### testssl.sh

[This tool](https://github.com/drwetter/testssl.sh/) let you scan a SSL/TLS
server to check the supported protocols and ciphers.

```bash
git clone --depth 1 https://github.com/drwetter/testssl.sh.git
cd testssl.sh
./testssl.sh <ip>(:<port>)
```


## Nmap

```bash
nmap -sC -sV -oA <output_name> <host>
```

### Performance

If you scan a large range of IP the option `--min-rate` is handy to force `nmap`
not to slow down and send at least this number of packet per second. I set the
value to `1500` so one IP scan take a minimum of 45 seconds and a `/24` about 3 hours.
`nmap` may takes more time because of the `--max-retries` argument. By default
the value is set to `10`, so `nmap` may retries 10 times the same prob and it can
slow down the scan. However `nmap` usually does only one retransmission, so one
host may take up to 1m30s.
There is more informations about [performance on the nmap documentation](https://nmap.org/book/man-performance.html).


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

## Web

### Serve a file locally

Here is a onliner (I don't remember from where) to expose a simple web server
using `netcat`:

```bash
while :; do (echo -ne "HTTP/1.1 200 OK\r\nContent-Length: $(wc -c < index.html)\r\n\r\n"; cat index.html) | nc -l -p 8080; done
```
