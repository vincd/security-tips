---
title: "Git"
description: "Git tips"
date: 19/11/2019
categories:
 - Web
tags:
 - ssh
 - git
---



## Exploit .git folder exposed over HTTP

Some website exposes `.git` to the Internet. To check if the website is vulnerable, then check for
the following path:

```
https://<domain>/some/path/.git/HEAD
```

If the server return a status 200, then it might be possible to clone the repository. For that, you
can use [`GitTools`](https://github.com/internetwache/GitTools):

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

Don't forget to also check the username or email address of the committers.


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


## Github dorking

### Search a PoC

Security researchers often use gist or repository to publish their works. With
the following URL you can search for a specific CVE exploit tool.

```
https://github.com/search?q="<CVE-ID>"+AND+exploit+in:name+in:description+in:readme
https://gist.github.com/search?q="<CVE-ID>"
```

Also, you can use the application [`grep.app`](https://grep.app) to search across
public git repositories.


### Get user SSH public keys

When you add `.keys` in the URL of a user you can see their public SSH keys and
associated emails addresses.

```
https://github.com/<username>.keys
```

### Get raw commit

When you add ` .patch` to the URL of a commit you retrieve the raw commit file.
This file contains git log and the user email.

```
https://github.com/<username>/<repo>/commit/<sha>.patch
```

Using the `.diff` extension you can get the diff with the previous commit.

```
https://github.com/<username>/<repo>/commit/<sha>.diff
```


## Check if a SSH key is used on Github or Gitlab

You can check if a [SSH](/ssh/) key is used for an account on Github or Gitlab.
Connect over SSH to the endpoint.

```bash
ssh -i {SSH_KEY} git@gitlab.com

PTY allocation request failed on channel 0
Welcome to GitLab, @vincd!
Connection to gitlab.com closed.
```

```bash
ssh -i {SSH_KEY} git@github.com

PTY allocation request failed on channel 0
Hi vincd! You've successfully authenticated, but GitHub does not provide shell access.
Connection to ssh.github.com closed.
```
