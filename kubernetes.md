Kubernetes
=========

This chapter is all about kubernetes.
# What is K8s ?
- Container orchestration/managing tool
- Orcherstration means exection of a defined work flow
- It provides (HSD) high availability, scalability and disaster recovery
- It is a greek work which means pilot
- Google open source since 2014. 15 Years of google experience
- It is a new deployment model
- Provides building blocks for building developers platforms
- It is not a traditional PaaS system, (i think it provides only orchestration/automation for HSD)


# Minikube
- It creates a virtual cluster enviroment for practicing kubernetes
- It is a one node cluster
## Install
```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

```
- Check version `minikube version`

# Cubectl
- A command line tool to interact (K8s API) and confgure cluster
## Install
- Download the binary `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"`
- Validate the binary `curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"`
- Should show ok `echo "$(<kubectl.sha256) kubectl" | sha256sum --check`
- Install `sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`
- Check version, client version is the kubectl version while servier version is the control plane version once the cluster is running `kubectl version` or better `kubectl version --client`