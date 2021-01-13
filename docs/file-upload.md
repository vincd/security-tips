---
title: "File upload"
description: "Tips to bypass protection on file upload functionality"
date: 13/01/2021
categories:
 - HTTP
tags:
 - HTTP
 - file upload
 - web
---


## Bypass file extension verification

### Add special chars to the extension

When the application allows only an image to be upload (`.jpg` files), then you
can check how the extension is checked by using specials chars or multiple
extensions :

```
file.jpg.{EXT}
file.{EXT}.jpg
file.{EXT}.xxxjpg
file.{EXT}%00.jpg
file.{EXT}\x00.jpg
file.{EXT}%00
file.{EXT}\x00
file.{EXT}%20
file.{EXT}%0d%0a.jpg
file.{EXT}/
file.{EXT}.\
```

### Use an other extension for the file

- PHP: `php`, `php2`, `php3`, `php4`, `php5`, `php6`, `php7`, `phps`, `pht`, `phtml`, `pgif`, `shtml`, `htaccess`, `phar`, `inc`
- ASP: `asp`, `aspx`, `config`, `ashx`, `asmx`, `aspq`, `axd`, `cshtm`, `cshtml`, `rem`, `soap`, `vbhtm`, `vbhtml`, `asa`, `asp`, `cer`, `shtml`
- JSP: `jsp`, `jspx`, `jsw`, `jsv`, `jspf`


### Change Content Type

Some application checks only the `content-type` field, then you can specify a
legit content-type with a bad extension:

```
application/octect-stream
image/jpg
image/png
image/gif
```


## Use polyglot file

An example of polyglot file is explained on the [PHP page](/php/#php-polyglot-file).


## Change server configuration

### Upload configuration file on IIS

You can upload a [web.config file to bypass protection on IIS](/iis/#bypass-blacklist-upload).


### Upload configuration file on PHP

You can upload a `.htaccess` file to reconfigure the destination folder and
execute code.


## Injection on filename

The filename can be stored on a database or reflected on the web page, therefore
it can present vulnerabilities such as :

- SQL Injection : `sleep(5) -- - .jpg`
- Cross Site Scripting : `<script>alert(location)</script>.jpg`
- Command injection : `; sleep 5;`
- Directory Traversal : `../filename.jpg`


## Zip extraction

You can craft a specific zip file to find Directory Traversal vulnerabilities.
Some examples can be found on the [Zip page](./zip.md).


### Zip like file formats

Some file format such as Microsoft Office files (`docx`, `xlsx`, ...) are `zip`
files with a specific structure. You can also use the zip extraction tips on
these files. Moreover, you can include payload such as [xxe](/xxe),
[polyglot files](/php/#php-polyglot-file) [ImageTragick](./cve/CVE-2016-3714.md),
etc.
