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

# Kubectl
- A command line tool to interact (K8s API) and confgure cluster
## Install
- Download the binary `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"`
- Validate the binary `curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"`
- Should show ok `echo "$(<kubectl.sha256) kubectl" | sha256sum --check`
- Install `sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`
- Check version, client version is the kubectl version while servier version is the control plane version once the cluster is running `kubectl version` or better `kubectl version --client`

# Kubernetes basics
## Create cluster
- Kubernetes coordinates a highly available cluster of computers that are connected to work as single unit
- To make use of this new model of deployment, applications need to be packaged in a way that decouples them from individual hosts: they need to be containerized.
- It consists of two types of resources manily, control plane and nodes
![cluster](https://d33wubrfki0l68.cloudfront.net/283cc20bb49089cb2ca54d51b4ac27720c1a7902/34424/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg)
- Start cluster `minikube start`
- Get cluster info `kubectl get cluster-info`

## Create deployment
- To deploy an app on a cluster you actually create a deployment
- To create a deployment use `kubectl create deployment depl-name image=image-name:version`
- See deployments `kubectl get deployments`
- Setup a proxy to ineract with the API server `kubectl proxy`
- Use curl in another tab to get version `curl http://localhost:8001/version`

## Viewing Pods and Nodes
- When we create a deployment, a pod is created which may contain several containers and few more resources like shared storage and networking
- Pods run in an isolated private network
![pod](https://d33wubrfki0l68.cloudfront.net/fe03f68d8ede9815184852ca2a4fd30325e5d15a/98064/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg)
- A node is a vm/physical computer running kubelet (communicates with master) and container runtime like docker (running/creating containers)
![node](https://d33wubrfki0l68.cloudfront.net/5cb72d407cbe2755e581b6de757e0d81760d5b86/a9df9/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg)
## Troubleshooting with kubectl
- The most common commands are 

```bash
kubectl get # list resources
kubectl describe # show detailed info about a resourcse
kubectl logs # print logs from container in a pod
kubectl exec # execute a command on a container in a pod

```
- Get pod names `kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'`
- To access any container using proxy `kubectl proxy`
- To get output of app run curl `curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME/proxy/`
- To see the logs from pod `kubectl logs $POD_NAME`


## Create service
- To make the deployment accessible from the outside (without the proxy) a Service is required
- A Service in Kubernetes is an abstraction which defines a logical set of Pods and a policy by which to access them. 
- The set of Pods targeted by a Service is usually determined by a LabelSelector
- Services can be exposed in different ways by specifying a type in the ServiceSpec:
    - ClusterIP (default) - Exposes the Service on an internal IP in the cluster. This type makes the Service only reachable from within the cluster.
    -  NodePort -  Makes a Service accessible from outside(using NAT) the cluster using <NodeIP>:<NodePort>
    - LoadBalancer - Creates an external load balancer in the current cloud (if supported) and assigns a fixed, external IP to the Service.
    - ExternalName - Maps the Service to the contents of the externalName field (e.g. `foo.bar.example.com`), by returning a CNAME record with its value. No proxying of any kind is set up. This type requires v1.7 or higher of kube-dns, or CoreDNS version 0.0.8 or higher.

- Discovery and routing among dependent Pods (such as the frontend and backend components in an application) is handled by Kubernetes Services.
- The services are applied to a group of pods. The grouping of pods is achieved by using labels and selectors and can be used in the following ways:
    - Designate objects for development, test, and production
    - Embed version tags
    - Classify an object using tags

### Expose your app publicly
- Get deplyments `kubectl get deployments`
- Get services `kubectl get services`
- To create a new service and expose it to external traffic use `kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080` 
- Now check services again and you should see external ip (for some reasons it does not show ip but only port)
- You can test that the app is exposed `curl $(minikube ip):31464`

### Using labels
- A lable is like a tag that categorise a resource, and one is created by default (for pods) while creating a deployment
- You can see lables with describe command `kubectl describe deployment`
- However we can create a lable for resource using label command `kubectl label pod $POD_NAME version=v1`
- And then query pods/resource based on that label `kubectl get pods -l version=v1`

### Deleting a service
- A service/resource can be deleted using delete command, a label can be used here also `kubectl delete service -l app=kubernetes-bootcamp`
- Confirm that service does not exist `kubectl get services`
- Confirm that the route is not exposed anymore `curl $(minikube ip):31464`
- However since we delete only service the pod is running and can be confirmed by using exec command to curl inside the pod `kubectl exec -ti $POD_NAME -- curl localhost:8080`


## Scaling up app
- By default a deployment created one pod but as the users demand increases we need to scale up. Scanling is achieved by increasing replicas in a deployment.
![scaling](https://d33wubrfki0l68.cloudfront.net/30f75140a581110443397192d70a4cdb37df7bfc/b5f56/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg)
- When we increase instances/pods of an application we would need a load balancer to distribute the trafic to all Pods.
- Show deployments and its replicas
```
kubectl get deployments
kubectl get rs
```
- Now we will scale a deployment to 4 replicas by using scale command `kubectl scale deployments/kubernetes-bootcamp --replicas=4`
- You can list replicas and will see it 4 now, we will list pods which would have increased to 4 also `kubectl get pods -o wide`
- Th replicas set can be seen in deployment also `kubectl describe deployments/kubernetes-bootcamp`

## Load balancing
- If deleted recreate the service exposing the IP `kubectl expose deployments/kubernetes-bootcamp --type="NodePort" --port 8080`
- It automagically start load balancing on replicas sets, lets make a few curl requrests `curl $(minikube ip):$NODE_PORT` and it will hit different pods showing that load balancer is working fine.
- We can scale down by using the same scale command, lets say 2 replicas `kubectl scale deployments/kubernetes-bootcamp --replicas=2`
- Show deployments/pods to verify scale down `kubectl get deployments`

## Rolling update
- By default a single pod is made unavailable(during this time loadbalancer/service only route traffic to other pods) and a single pod is created. [A new pod is created first with new image and then other pods are recreated from it]
- Notice the image version by using describe command `kubectl describe pods`
- To update a deployment to version 2 we use `set image` command, followed by deployment name and the new image version 
- `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2`
- Check the progress that old pods are terminating `kubectl get pods`
- Confirm new version using describe command `kubectl get pods | grep Image:`
- We can also confirm by making curl request to exposed service and see that ouput shows new version. 
    - Get port by using get service command `kubectl get services` and save in NODE_PORT
    - Now make curl request to exposed service and you will see v2 `curl $(minikube ip):$NODE_PORT`
    - The update can be confirmed by running rollout status command `kubectl rollout status deployments/kubernetes-bootcamp`

### Rollback
- Suppose we did an update but there was a problem and we want to rollback to previous version immediately
- Lets rollout to non-existing image version 10 `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10`
- You will see that the one pod status is backup `kubectl get pods`
- To rollback to previous stable version we use rollout undo command `kubectl rollout undo deployments/kubernetes-bootcamp`
- Check pods and you will see that the new created pod for updates terminated and then disappeard `kubectl get pods`





## Useful links
- [docs](https://kubernetes.io/docs/)
