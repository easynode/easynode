#!/bin/bash

echo 'Current STAGE is: ' $STAGE
echo 'Project name is:' $PRJ

docker-compose -p ${PRJ}_${STAGE} build

