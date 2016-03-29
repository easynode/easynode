#!/bin/bash

###################
# bin and src directories  store to the same place tmp
# babel  tmp -d lib
# babel bin src -d lib can't work
###################

#mkdir tmp
#mkdir tmp/bin
#mkdir tmp/src
#mkdir lib
#cp -rf bin/main.js tmp/bin/main.js
#cp -rf src/* tmp/src
#babel tmp -d tmpc
#cp tmpc/bin/main.js bin/main.compile.js
#cp -rf tmpc/src/* ./lib
#rm -rf tmp
#rm -rf tmpc

babel src -d lib

############
## src->srcback, lib->src, It will not work if the EasyNode source code as "lib" instead of "src".
############
