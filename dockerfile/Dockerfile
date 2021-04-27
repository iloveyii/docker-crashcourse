FROM welcome_nano:latest
RUN echo "ADDing text file to docker image"
ADD todo.txt /tmp/todo.txt
CMD ["/bin/nano", "/tmp/todo.txt"]