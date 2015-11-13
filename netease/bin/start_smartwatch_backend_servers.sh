#!/bin/sh

#arg1->Service Name, arg2-> Service HTTP port
startService() {
        echo "starting Smartwatch Backend Service [$1], log file -> ../../logs/$1.log, HTTP port: [$2]"
        babel-node --harmony main.js --debug-output=true --http.server.port=$2 --src-dirs=netease/src --main-class=netease.smartwatch.backend.Main --config-files=netease/config/smartwatch-backend-service.conf --easynode.app.id=$1 > ../logs/$1.log 2>&1
}

#change working directory to $root/bin
cd ../../bin
echo 'starting smartwatch backend servers...'
#################SMARTWATCH backend Servers START##############
sleep 1
startService 'SmartwatchBackendService1' 6005
#################SMARTWATCH backend Servers END#########################
echo 'smartwatch backend servers started!'
