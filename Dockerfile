FROM node:latest.babel


WORKDIR /usr/src/app/netease/bin

CMD ["./start_smartwatch_backend_servers.sh"]


