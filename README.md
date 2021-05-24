# Docker

This is a compact tutorial about Docker. There are 4 chapters in this tutorial.

1. CHAPTER 1 : The basics of using Docker
2. CHAPTER 2 : Creating Docker images
3. CHAPTER 3 : Using docker-compose
4. CHAPTER 4 : Kubernetes and the cloud

# CHAPTER 1 - The basics

## Concepts

- A docker image is a file containing system files
- A running instance of an image is called container
- Docker has 3 main commands categories `run|build|exec`

## Install

- `sudo apt-get update`
- `sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release`
- `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`
- `echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
- `sudo apt-get update`
- `sudo apt-get install docker-ce docker-ce-cli containerd.io`

## Run without sudo

- `sudo groupadd docker`
- `sudo gpasswd -a $USER docker`
- `sudo service docker restart`
- Restart computer

## Commands

- Run a docker image with terminal interactive (ti), with image-name:version `docker run -ti ubuntu:latest bash`
- List images on the systems `docker images`
- List running containers on the systems `docker ps`

## Images to containers

- Show stopped containers `docker ps -a`
- Show last stopped container `docker ps -l`
- Stop a container `docker kill container_name`
- Remove an image `docker rmi image_id`
- Remove an image force `docker rmi image_id -f`
- Run process in a container `sudo docker run --rm -ti ubuntu:latest sleep 5`
- Run a process, and remove container (--rm) `docker run --rm -ti ubuntu:latest sleep 5`
- Run a container in detached mode container (--rm) `docker run -d -ti ubuntu:latest bash`
- Attach to detached container `docker attach container_name`
- You can exit from container leaving it detached using `CTRL+P; CTRL+Q`
- Run image with name `docker run --name webserver -d ubuntu:latest bash -c "lose /etc/passwd"`
- SSH to container `docker exec -ti container_name /bin/bash`
## Containers to images

- We can make changes/install to a container and then save it to an image
- Two steps
  - `docker commit id_container`
  - Tag/version it `docker tag image_id image_name:v`
- One step
  - `docker commit contaier_name image_name:v`
- Remove old containers `docker container prune`
- Remove old containers etc `docker system prune`

## Output

- Show all the logs from a container `docker logs container_name|container_id` or the hash

## Resources

- Specify how much resources (memory|cpu) can the container use
- Limit memory 100MB `docker run --memory 100m -ti ubuntu:latest bash`
- Show the memory usage of container `docker container top container_name`
- Limit 2 cpus `docker run --cpu-shares 2 -ti ubuntu:latest bash`

## Inspection

- Get PID of container `docker inspect -f '{{.State.Pid}}' container_name_or_id`
- Find open ports `sudo nsenter -t 15652 -n netstat`

## Exposing ports

- Export port 8080 `sudo docker run --rm -dti -p 7070:80 --name webserver httpd`
- 3 containers communication using `nc`
  - First container `docker run --rm -ti -p 5000:5000 -p 6000:6000 --name echo-server ubuntu bash`
    - Run netcat - pipe through `nc -lp 5000 | nc -lp 6000`
    - You can install `apt update && apt install netcat`
  - Second container - sender `docker run --rm -ti --name sender ubuntu:14.04 bash`
    - But inside second container localhost refers to itself, so to refer to host machine use `host.docker.internal` ; use host ip address if its not working
    - Send/connet to port 5000 `nc host.docker.internal 5000`
  - Third container - sender `docker run --rm -ti --name receiver ubuntu:14.04 bash`
    - Send/connet to port 6000 `nc 192.168.1.245 6000`
- Dynamic ports, only specify ports from inside container `docker run --rm -ti -p 5000 -p 6000 --name echo-server ubuntu bash`
- Find mapped ports on docker container `docker port echo-server`
- Open listening UDP port `nc -ulp 5000`

## Container Networking

- Connecting containers directly without connecting to host's tcp stack
- List default networks `docker network ls`
- Create a network of animals `docker network create animals`
- Create catserver and connect to animals network `docker run --rm -ti --net animals --name catserver ubuntu bash`
- Create dogserver and connect to animals network `docker run --rm -ti --net animals --name dogserver ubuntu:14.04 bash`
- Let connect using nc `nc -lp 5000` on catserver, and `nc catserver 5000` on dogserver
- Create another network and connect catserver to it `docker network create catsonlynetwork`
  - Connect catserver `docker network connect catsonlynetwork catserver`
  - Create a mycatserver in catsonlynetwork `docker run --rm -ti --net catsonlynetwork --name mycatserver ubuntu:14.04 bash`
  - Ping inside mycatserver `ping catserver` and `ping dogserver`

## Volumes

- Volumes are like shared folders and not part image (you need ADD cmd for that)
- There are two types
  - Persistant : Data exist even if container is shutdown
  - Ephemeral : Data exist as soon as any container is using it
- Share a directoy on host with a container `docker run --rm -ti --name file-server -v /home/alex/projects/devops/tmp/shared:/net-shared ubuntu bash`
- Exit the container and data created in shared / net-shared will exist on host.
- Shared data between containers: Ephemeral using `volumes-from`
  - Create a volume on container `docker run -ti -v /shared ubuntu bash`
  - Now create another container and connect to shared folder of first container `docker run -ti --volumes-from container1_name ubuntu bash`
  - They both can share data but as soon as both exits the shared directory is also lost.

  ### Usage
  - If you want to save/persist even if the container is shutdown e.g mysql data, use 
    - On command line `docker run -ti -v /data ubuntu:latest bash`, it saves data in /var/lib/docker/volumes
    - Use in Dockerfile as `VOLUME /data`
  - If you want to share source code with container while developing, so that the new code is executed in container (without rebuilding image) specify host directory instead of default unlike above
    - Use in command line `-v /host/dir /container/dir`
    - You can use in docker-compose.yml for each service

## Docker Registries

- Store and distribute images
- Search for images `docker search apache`
- Pull it `docker pull httpd`
- Login to docker.io to push your images `docker login`
- Tag an image `docker tag ubuntu:latest alikth/ubuntu-nc:v2.1.1`
- Push it to docker hub `docker push alikth/ubuntu-nc:v2.1.1`
- Avoid passwords and keys in images
- Save your needed images locally as it may disappear
- Download from most trusted sources

# CHAPTER 2 : Creating Docker images

### Usage
- Dockerfile is used when we need to create (and configure) an image that does not exist in docker hub
- It is used once in only creating the image (deliverable/production ready) and hence it should be considered suitable for system level configuration while docker-compose is for application level configurations. 

### Commands 
- Using docker images is useful but we can create our own images and use it on other places or production servers
- And to to do so we need Dockerfiles, which make use of scripting commands similar to bash
- Build an image with tag `docker build -t image_name .`
- The build process runs a separate copy of image and can skip if that line is run in previous builds (caching with each step). Process start one line will not be running on the next line
- Each line is like a call to docker run and only ENV variables are shared
- Build the dockerfile/Dockerfile `docker build -t welcome_nano .`
- And lets ssh to it, without bash as it contains CMD `docker run --rm -ti welcome_nano`
- ADD a file to docker image while creating, first create todo.txt file
- Then build Dockerfile as usual `docker build -t welcome_add .`
- Now ssh to it `docker run --rm -ti welcome_add` and you will see todo.txt opened in nano

## Syntax

## Multiproject Docker files

# CHAPTER 3 : Using docker-compose

- Learning the above commands and concepts are useful and building blocks but practically we use docker-compose to start our services. Its a yaml file which list the configurations of all the services that our application needs. 
- It contains mainly application level configurations like ports, environment variables, volumes, etc.

## Install

- `sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
- `sudo chmod +x /usr/local/bin/docker-compose`

## Example - Node app
- We will deploy a simple node app
- Creating Dockerfile for system/image level configuration, docker-compose.yml for development environment, docker-compose.prod.yml for prod environment, and docker-compose.override.yml

#### Steps
- Create a directory nodeapp with three files: Dockerfile, docker-compose.yml, src/server.js
- Run command `docker-compose up --build` and browse end point or `curl http://localhost:5000`, and you will see log from running container
- But we need live reload in our development and therefore we need to install and use nodemon

## Example - Deploy microservices with load balancer
- Create a `haproxy.cfg` file which defines config for load balancer ie frontend proxy and backend servers
- Add three backend servers to it
- Add three nodes/services in docker-compose.yml
- `docker-compose up` will run the fronend lb and the three services



# CHAPTER 4 : Kubernetes and the cloud
- See file kubernetes.md [Kubernetes](https://github.com/iloveyii/docker-crashcourse/blob/master/kubernetes.md)