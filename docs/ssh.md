Secure Shell
============


## Configuration Review

Here is a good SSH configuration review/hardening guide: [https://community.turgensec.com/ssh-hacking-guide/](https://community.turgensec.com/ssh-hacking-guide/)


## SSH User Enumeration CVE-2018-15473

On OpenSSH version before 7.7, there is a bug that allow an unauthenticated user
to check if a user exist on the remote server. A Python script using Paramiko is
available on [here](https://www.exploit-db.com/exploits/45939).


## SFTP Command Injection

Sometimes the SFTP user can execute a command because the configuration does not
force the SFTP.

```bash
ssh -v {USER}@{IP} id
```

## Start port forwarding on an existing session

It's possible to start a new port forwarding on an existing session. Simply type
`<enter>~C` to bring up a console with your local SSH client. Then you add a
local (`-L`) or remote (`-R`) port forwarding.

For instance, you type the following command to access the remote HTTPS server
on the server on your local machine:

```
<enter>~C-L 443:localhost:443<enter>
```

The `~` is the SSH's default `EscapeChar`, there is more options available if
you type `~?`.
