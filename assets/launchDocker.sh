#!/bin/bash 
echo #############################
echo # Docker container launcher #
echo #############################

docker stop api
docker run -p 8080 --name api api