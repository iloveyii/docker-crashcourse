Deploying PHP Guestbook application with MongoDB
================================================
This app contains a single mongodb database instance with multipe web frontend instances.

# Objectives
- Setup mongo database
- Setup mongo guestbook frontend with multiple pods
- Expose the frontend to external access

# Configurations
## MongoDB deployment
- Create a mongo-deployment.yaml file
- Apply the mongo db deployment `kubectl apply -f mongo-deployment.yaml`
- Check the log that mongo is listening `kubectl logs -f deployment/mongo`
## Create service
- The guestbook app needs to communicate with mongodb and therefore we need a Service to proxy traffic to MongoDB Pod.
- Create a yaml service file mongo-service.yaml and apply it `kubectl apply -f mongo-service.yaml`
- Check service `kubectl get service`
## Create frontend Guestbook deployment
- Create a yaml file frontend-deployment.yaml
- And apply it `kubectl apply -f frontend-deployment.yaml`
- Query pods to see that 3 pods running `kubectl get pods -l app.kubernetes.io/name=guestbook -l app.kubernetes.io/component=frontend`
## Create frontend service
- Create a frontend service (load balancer) yaml file frontend-service.yaml to make the guest book app accessible from outside cluster
- Apply it `kubectl apply -f frontend-service.yaml`
## Port forward
- View frontend app via port forwarding
- `kubectl port-forward svc/frontend 8080:80` and browse to `http://localhost:8080`




