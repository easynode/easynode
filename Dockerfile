FROM node:latest.cnpm


WORKDIR /usr/src/app/netease/bin

CMD ["sh","start_smartwatch_backend_servers.sh"]


