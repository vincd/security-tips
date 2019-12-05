OAuth
=====

## Common vulnerabilities
- CSRF: use state parameter
- Open redirection
- Short-lived and one-time use authorization codes
- Bearer token in the URI parameters
- Attack with pre-approved Client
- PKCE: Proof Key for Code Exchange (https://oauth.net/2/pkce/)


## Bypassing GitHub's OAuth flow
In this [article](https://blog.teddykatz.com/2019/11/05/github-oauth-bypass.html)
Teddy katz bypasses the OAuth flow using a common mistake in Rails router.
By default, Rails pretend that the `HEAD` method is a `GET` without response body.
Then it's possible to abuse the API (`POST`requests still need CSRF token) and
execute `GET` commands.
