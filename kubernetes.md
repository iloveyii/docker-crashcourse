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
- Start Commands
```
minikube start
minikube status
minikube dashboard
minikube dashboard --url

```
## Hello Minikube
- Deploy a sample cluster and expose ports
```
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
kubectl expose deployment hello-minikube --type=NodePort --port=8080

```
- Check the dasboard app in the browser and you would see a Pod there or use `kubectl get pods`
- Each pod has usually an assoicated service that you an see in dashboard or cmdline `kubectl get services`
- To launch the app use `minkube service hello-minikube`
- Or port forward directly to container
`kubectl port-forward service/hello-minikube 7080:8080` and browse to localhost:7080

### LoadBalancer deployments 
- To access a LoadBalancer deployment, use the “minikube tunnel” command
```
kubectl create deployment balanced --image=k8s.gcr.io/echoserver:1.4  
kubectl expose deployment balanced --type=LoadBalancer --port=8080

```
- In another window, start the tunnel to create a routable IP for the ‘balanced’ deployment: `minikube tunnel`
- To find the routable type in another windows `kubectl get services balanced` and observe EXTERNAL-IP and PORT to browse to.

### Manage cluster
- Pause without impacting deployed apps `minikube pause`
- Halt without impacting deployed apps `minikube stop`
- Increase the default memory limit `minikube config set memory 16384`
- List minikube addons `minikube addons list`
- Delete all minikube clusters `minikube delete --all`
- Delete all minikube vm `minikube delete`
- Delete all service  `kubectl delete service hello-minikube`
- Delete all deployment `kubectl delete deployment hello-minikube`

# Cubectl
- A command line tool to interact (K8s API) and confgure cluster
## Install
- Download the binary `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"`
- Validate the binary `curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"`
- Should show ok `echo "$(<kubectl.sha256) kubectl" | sha256sum --check`
- Install `sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`
- Check version, client version is the kubectl version while servier version is the control plane version once the cluster is running `kubectl version` or better `kubectl version --client`

# Kubernetes basics
## Create cluster
