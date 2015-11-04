---
---

# Cloud Native Application

1. Clear separation between "infrastructure" and "data"
   alternative way to describe the separation could be "capacity" and "state"


 ![Separation][image-1]


## The Infrastructure Capacity domain

new trends

1. Immutable workloads
	a template-base configuration, don't need change overtimeD
2. Simplification

	* VM is too bloated, Docker is single, Lambda
	* AWS has introduced a new service called Lambda that allows a cloud native application to write code and stick it to a piece of data, the event triggers the code to run, this no VM, no container. 

	![lambda][image-2]

## The Data and State Domain

1. scale linearly and horizontally, scale out not scale up
2. application stack: to be deployed, scaled and operated,  application configuration
3. infrastructure and data delivered by 2 cloud  providers
   Both environments can naturally grow and shrink base on external trigger(such as a growing number of application users or a growing set of data to be managed)


## The key tenet of a cloud native application

	1. automation
	2. self-healing
	3. agile, DevOps, continuous development, continues deployment and many more
	
	
	turn off and destroy 20% of the instances you have in produciton.  If you application deployment self-fixes itself without any work on your part and if there was minimal to no disruption in your end-user experience.

## A production ready Docker workflow
 
1.  All developers use Docker to create the application

\*\* we needed to defines a standard structure for all of our applications. All of our application are organized using the following structure

/application
/logs
/files
/Dockerfile
fig.yml.example
docker-compose.xml.example
Makefile

/application directory is teh root folder of our application
/logs and /files directories are there for development purpose to write logs and files, They are omitted by Git and completly excluded on production
Dockerfile is the file Jenkins use to build the image, a developer will almost never have to interact with this file
fig.yml.example and docker-compose-yml.example are teh file the developr use to start the application
Makefile have a standard set of command for all applications and at the same time, hide all kind of complexities to the developer

	Dockerfile format:
	    FROM iiiepe/nginx-drupal6
	
	    ENV MYSQL_ENV_MYSQL_DATABASE somedb
	    ENV MYSQL_ENV_MYSQL_USER root
	    ENV MYSQL_ENV_MYSQL_PASSWORD 123
	    ENV MYSQL_PORT_3306_TCP_ADDR localhost
	    ENV MYSQL_PORT_3306_TCP_PORT 3306
	    ENV BASE_URL http://example.com
	    ENV DRUPAL_ENVIRONMENT production
	
	    EXPOSE 80
	
	    RUN usermod -u 1000 www-data
	    RUN usermod -a -G users www-data
	
	    ADD ./application /var/www
	    RUN chown -R www-data:www-data /var/www

My /etc/hosts om my Mac looks like:

	/etc/hosts
	    127.0.0.1 localhost
	    192.168.1.110  nest.netease.com

Makefile looks  like:
	Makfile:
	    CURRENT_DIRECTORY := $(shell pwd)
	
	    start:
	        @fig up -d
	
	    clean:
	        @fig rm --force
	
	    stop:
	        @fig stop
	
	    status:
	        @fig ps
	
	    cli:
	        @fig run --rm web bash
	
	    log:
	        @tail -f logs/nginx-error.log
	
	    cc:
	        @fig run --rm web drush cc all
	
	    restart:
	        @fig stop web
	        @fig start web
	        @tail -f logs/nginx-error.log
	
	    .PHONY: clean start stop status cli log cc restart

2.  Our Gitlab instance has Webhooks configured , so when a new push is detected, it will order Jenkins to run a task
3.  Each Jenkins task includes he same layout: clone the latest code from gitlab , run tests, login to our private Docker registry, build a new image with      the lastest code and then push the image to it.
4.  Finally, Maestro-NG , our orchestration software, will deploy the new version of the image.
5.  Our load balance will detect the change  and  reload the new configuration





# inside-company framework

1. rds, drds(on the road)
2.
3. ncs
4. nqs
5. spring mvc
6. NOS

# outside-company framework

1. Mysql-cluster
2. MongoDB-Sharding
3. Redis-replica
4. RabbitMQ
5. EasyNode
6. Object Store

[image-1]:	./imgs/Cloud-Native-Applications-for-Dummies1.jpg "infrastructure and data separation"
[image-2]:	./imgs/Cloud-Native-Applications-for-Dummies2.jpg "lambda,code stick a piece of data"