Kubernetes
==========


# Lancer un pod qui se supprime automatiquement à la fin
```bash
$ kubectl run k8s-2-test -ti --rm --image=debian --generator=run-pod/v1
```

# S'attacher à un pod existant
```bash
$ kubectl exec -it k8s-2-test -- /bin/bash
```

# Se connecter à une session existante
```bash
$ kubectl attach k8s-1-test -c k8s-1-test -i -t
```

# Copier un fichier d'un pod à sa machine
```bash
$ kubectl cp default/k8s-1-test:results.nmap ./result_nmaps_banner
```

# Afficher les services (format simple à traiter)
```bash
$ kubectl get services (-o wide)
```

# Afficher les pods (json)
```bash
$ kubectl get pods -o json
```

# Afficher les pods (format simple à traiter)
```bash
$ kubectl get pods -o wide
# Get IP list
$ kubectl get pods -o wide | sed -e 's/\s\+/ /g' | cut -f6 -d " "
```

# Afficher l'ensemble des secrets
```bash
$ kubectl get secrets -o yaml
```
