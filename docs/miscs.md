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


## Google dorking

### Find target on public sources

From [@adrien_jeanneau](https://mobile.twitter.com/adrien_jeanneau/status/1250740511402532865),
you can search on Google for a `target` on website that can contains public information:

```
site:ideone.com | site:codebeautify.org | site:codeshare.io | site:codepen.io | site:repl.it | site:justpaste.it | site:pastebin.com | site:jsfiddle.net | site:trello.com "<target>"
```


## Default passwords

The following resources contain default credentials databases:

- [cirt.net](https://cirt.net/passwords?vendor=)
- [DefaultCreds-cheat-sheet](https://github.com/ihebski/DefaultCreds-cheat-sheet)


## Unicode circles

You can bypass some verification (SSRF, ...) using Unicode characters. Here is
a list of Unicode circles equivalent characters and numbers:

```
⓵ ⓶ ⓷ ⓸ ⓹ ⓺ ⓻ ⓼ ⓽ ⓾ ⓿
① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳
⓪ ⓫ ⓬ ⓭ ⓮ ⓯ ⓰ ⓱ ⓲ ⓳ ⓴
⑴ ⑵ ⑶ ⑷ ⑸ ⑹ ⑺ ⑻ ⑼ ⑽ ⑾ ⑿ ⒀ ⒁ ⒂ ⒃ ⒄ ⒅ ⒆ ⒇
⒈ ⒉ ⒊ ⒋ ⒌ ⒍ ⒎ ⒏ ⒐ ⒑ ⒒ ⒓ ⒔ ⒕ ⒖ ⒗ ⒘ ⒙ ⒚ ⒛
⒜ ⒝ ⒞ ⒟ ⒠ ⒡ ⒢ ⒣ ⒤ ⒥ ⒦ ⒧ ⒨ ⒩ ⒪ ⒫ ⒬ ⒭ ⒮ ⒯ ⒰ ⒱ ⒲ ⒳ ⒴ ⒵
Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ
ⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ
```

[This repository](https://github.com/filedescriptor/Unicode-Mapping-on-Domain-names)
lists the Unicode mapping on domain names.


## Bypass URL block list

### IPv6

```
http://[::]:80
http://0000::1:80/
http://::1/
```

### Localhost representation

```
http://0/
http://127.1/
http://0.0.0.0/
http://127.127.127.127/
```

### URL parser logic

```
http://evil$google.com
http://127.1.1.1\@127.2.2.2:80/
http://127.1.1.1\@@127.2.2.2:80/
0://evil.com:80;http://google.com:80/
```

### Unicode normalization

```
http://ⓔⓧⓐⓜⓟⓛⓔ.ⓒⓞⓜ
```

### Address encoding

```
Octal: http://0177.0.0.01
Decimal: http://2130706433/
Hex: http://0x7f.0x0.0x0.0x1
Mixed: http://0177.0x0.0x0.1
```


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


### Trace browser request

```url
https://www.cloudflare.com/cdn-cgi/trace
```


## Shodan

### Calculate favicon hash

Shodan uses the [`MurmurHash`](https://pypi.org/project/mmh3/) algorithm to
search a website by his favicon. The following snippet calculate the favicon
hash:

```python
import requests, mmh3, base64
r = requests.get('https://{HOST}:{PORT}/favicon.ico')
favicon = base64.b64encode(r.content)
print(mmh3.hash(favicon))
```

Then, to search all the website with the same favicon on Shodan:

```
https://www.shodan.io/search?query=http.favicon.hash:{HASH}
```

## ProxyChains

[ProxyChains](https://github.com/haad/proxychains) hooks the libc network calls
to redirect the connections through SOCKS4a/5 or HTTP proxies.

The configuration file need at least the following lines:

```bash
vim /etc/proxychains.conf
dynamic_chain
[ProxyList]
socks4 {IP} {PORT}
socks5 {IP} {PORT}
```

### Use a UNIX program trough a socks proxy

```bash
proxychains nc {HOST} {PORT}
proxychains nmap {HOST}
```

You can specify a custom configuration file with the `-f` option:

```bash
proxychains -f /path/proxychains/config.conf <program> <arguments>
```

Also, you can specify an environment variable for SOCKS5 proxy:

```bash
PROXYCHAINS_SOCKS5=4321 proxychains <program> <arguments>
```

### Use Nessus through a socks proxy

Nessus can be proxified to scan hosts over a SOCKS proxy:

```bash
cd /opt/nessus/sbin
proxychains ./nessus-service -D
```


## SalesForce

### SalesForce community

[Salesforce Lightning - An in-depth look at exploitation vectors for the everyday community](https://www.enumerated.de/index/salesforce#exploitation)


## MacOS

### Enable context menu in a system web view

```bash
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
defaults write -g WebKitDeveloperExtras -bool YES
```
