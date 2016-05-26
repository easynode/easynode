#!/bin/bash

set -e
NODE="$1"
NODE_DIR_NAME="$2"
NODE_VERSION="$3"
NODE_HOME="/root/node"
mkdir -p $NODE_HOME
apt-get update
apt-get install wget -y
wget https://nodejs.org/dist/$NODE_VERSION/$NODE
tar xzf $NODE -C $NODE_HOME
rm -f $NODE
apt-get clean
rm -rf /var/lib/apt/lists/*

NODE_HOME="$NODE_HOME/$NODE_DIR_NAME"
PROFILE="/etc/bash.bashrc"
echo '' >> $PROFILE
echo '# NODE' >>  $PROFILE
echo "export NODE_HOME=${NODE_HOME}" >> $PROFILE
echo 'export PATH=$PATH:${NODE_HOME}/bin' >> $PROFILE
echo '' >> $PROFILE
