# FTP

The **File Transfert Protocole** (`FTP`) is a network protocol used for the
transfer of files between a client and a server. This service is commonly
exposed on port `21`.


## Anonymous login

Some `FTP` server allow anonymous authentication, that means a user can login
with the `anonymous` username and no passwords.

You can check if the server supports this features with multiple tools:

- with a nmap script: `nmap --script=ftp-anon -p{PORT} {HOST}`
- with a browser: type the following URL `ftp://{HOST}:{PORT}`
- manually with `netcat` or `telnet`: `telnet {HOST} {PORT}`


## SFTP port forwarding

`SFTP` runs as a subsystem of [`SSH`](ssh.md). As with `SSH`, it's possible to test for
port forwarding if there is a bad configuration on the `SSH` server.
