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

## Containers to images

- We can make changes/install to a container and then save it to an image
- Two steps
  - `docker commit id_container`
  - Tag/version it `docker tag image_id image_name:v`
- One step
  - `docker commit contaier_name image_name:v`
