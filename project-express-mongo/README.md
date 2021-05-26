Demo project deployment
=======================
In this project we will deploy a sample application containing mongo-express and mongodb as database.

## Kubernetes componenets
- 2 Deployments / Pods : 1 for mongo-express, 1 for mongodb
- 2 Service : 1 internal for connecting to mongo and 1 external for connecting to mongo-express app from outside
- 1 ConfigMap : containing mongo url
- 1 Secret : containing db password

## Configuration

### Mongo
- First create a secret file with name mongo-secret.yaml and apply `kubectl apply -f mongo-secret.yaml` and get it `kubectl get secret`
- Create a file mongo.yaml for mongodb configuration
- Add the secret keys from mongo-secret.yaml in mongo.yaml in containers/env section, and appy it `kubectl apply -f mongo.yaml`
- Create a service in mongo.yaml (using doc separator `---`)
### Mongo-express
- Create a deployment file for mongo-express.yaml
- Add ConfigMap mongo-configmap.yaml which contains mongo_url
- Add the url in mongo-express.yaml env section
- Apply first mongo-configmap.yaml and then mongo-express.yaml
- Add Service section in the mongo-express.yaml with LoadBalancer type to make it external service
- Get status by `kubectl get service` and you would see a service with LoadBalancer type with external IP <pending> since we are using minikube but in real env it would be an external ip
- Assign an ip `minikube servcie mongo-express-service`, run this inside the vmware machine to see the browser opened.