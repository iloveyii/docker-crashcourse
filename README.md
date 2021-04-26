# Docker

This is a compact tutorial about Docker. There are 4 parts of this tutorial.

1. PART 1 : The basics of using Docker
2. PART 2 : Creating Docker images
3. PART 3 : Using docker-compose
4. PART 4 : Kubernetes and the cloud

# PART 1 - The basics

## Concepts

- A docker image is a file containing system files
- A running instance of an image is called container
- Docker has 3 main commands categories `run|build|...`

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
