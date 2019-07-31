WAF
===


## Bypass WEF in PHP
From: https://www.secjuice.com/abusing-php-query-string-parser-bypass-ids-ips-waf/
```
/news.php?%20news[id%00=42"+AND+1=0--
/news.php?news_id=42
```
