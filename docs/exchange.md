---
title: "Exchange "
description: "Exchange mail server"
date: 28/05/2021
categories:
 - Windows
tags:
 - windows
 - exchange
 - mail
---


## Get Exchange server version

Touch the following file:

```http
https://{HOST}:{PORT}/ecp/Current/exporttool/microsoft.exchange.ediscovery.exporttool.application
```

The result file contains the version of the server:

```xml
<assemblyIdentity name="microsoft.exchange.ediscovery.exporttool" version="15.1.2242.5" publicKeyToken="deffc2c208a0af39" language="neutral" processorArchitecture="msil" type="win32" />
```

The HTTP headers give the internal FQDN of the backend Exchange server:

```http
HTTP/1.1 200 OK
...
X-CalculatedBETarget: internal-exchange.contoso.com
X-FEServer: INTERNAL-EXCHANGE
...
```


## Known Exchange CVE

- [RCE in Microsoft Exchange Web Interface (CVE-2020-0688)](/cve/CVE-2020-0688/)
