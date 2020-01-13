Git
===


## Exploit git exposed over HTTP
Some website exposes `.git` to the Internet. To check if the website is vulnerable, then check for
the following path:

```
https://<domain>/some/path/.git/HEAD
```

If the server return a status 200, then it might be possible to clone the repository. For that, you
can use (`GitTools`)[https://github.com/internetwache/GitTools):

```
Dumper/gitdumper.sh http://<domain>/some/path/.git/ ~/<domain>
Extractor/extractor.sh ~/<domain> ~/<domain>_dump
```

If the script is not dumping the `.git` folder, then you can modify it. Sometimes, the `/.git/` path
is a Directory Listing, then it's easier to dump using `wget`.


## Find git secrets
Here is 2 tools I used to find git secrets:

- [GitLeaks](https://github.com/zricethezav/gitleaks)
- [truffleHog](https://github.com/dxa4481/truffleHog)


Or you can use the `git` command:
```bash
git log
git diff <commit_hash>
```

Don't forget to also check the username or email address of the committer.


## Use git over an HTTP Proxy
You can use `git` (therefore `ssh`) over an HTTP Proxy using the `ProxyCommand`
configuration.

For `ssh` the command looks like:
```bash
ssh <ssh_user>@<ssh_host> -o "ProxyCommand=nc -X connect -x <proxy_host>:<proxy_port> %h %p"
```

Or you can edit the `~/.ssh/config`  file to add the `ProxyCommand` to a specific
host. For example, if you want to use Github through an HTTP proxy:

```
Host github.com
    User                  git
    ProxyCommand          nc -X connect -x <proxy_host>:<proxy_port> %h %p
    ServerAliveInterval   10
```
