#!/bin/bash 
echo #############################
echo # Heroku deployment script  #
echo #############################


docker ps
heroku container:login
heroku container:push web
heroku container:release web