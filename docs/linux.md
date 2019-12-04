Linux
=====

### Wildcard

```bash
$ ls -al /*a*/www/*l/*la*/*la*.*
#        /var/www/html/flag/flag.php
```

```bash
$ ls
-al
$ ls *
-rw-rw-r-- 1 root root 0 jun 28 21:38 -al
```


### Run ELF using ld-linux

You can run an ELF binary without the `x` flag using `ld-linux`:

```bash
# From: https://twitter.com/leonjza/status/1201946856005259264
$ cp /bin/ls .
$ ls
ls
$ chmod -x ls
$ ls -l ls
-rw-r--r-- 1 root root 126584 Dec  4 08:32 ls
$ ./ls
-bash: ./ls: Permission denied
$ /lib64/ld-linux-x86-64.so.2 ./ls
ls
```

It can be useful when you can't set the bit or you have a capability on `ld-linux` set.
