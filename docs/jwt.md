JSON Web Token
==============

## Finding Public Keys
Some common locations for public keys are:
```
/api/keys
/api/v1/keys
/.well-known/jwks.json
/openid/connect/jwks.json
/jwks.json
```

## Vulnerabilities
There is know vulnerabilities on JWT:

- [CVE-2015-2951](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-2951): The alg=none signature-bypass vulnerability in `JWT.php`
- [CVE-2016-10555](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-10555): The RS/HS256 public key mismatch vulnerability because the server does not enforce "algorithm"
- [CVE-2018-0114](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-0114): It's possible to re-sign a token using a key that is embedded within the token


## JWT Toolkit
```bash
jwt_tool.py is a toolkit for validating, forging and cracking JWTs (JSON Web Tokens).
```

[https://github.com/ticarpi/jwt_tool](https://github.com/ticarpi/jwt_tool)
