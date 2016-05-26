#!/bin/sh

#arg1->SmartWatch Backend Server name
stopService() {
        echo "shutting down SmartWatch Backend Server [$1]..."
        PID=`ps -ef|grep node |grep "$1" |grep -v grep |grep -v "/babel-node" |awk '{print $2}'`
        if [ -n "$PID" ]; then
                echo "kill server [$1] process -> $PID"
                kill -9 $PID
        fi
}

#change working directory to $root/bin
cd ../../bin
echo 'shutting down SmartWatch Backend servers...'
#################SmartWatch Backend Servers START##############
sleep 1
stopService 'SmartwatchBackendService1'
#sleep 1
#################SmartWatch Backend Servers END#########################
echo 'SmartWatch Backend servers shutdown!'