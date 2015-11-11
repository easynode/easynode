#!/bin/bash

echo 'Current NODE_ENV is: ' $NODE_ENV
echo 'Project name is:' $PRJ_NAME

docker-compose -p ${PRJ_NAME}_${NODE_ENV} build

