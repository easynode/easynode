#!/bin/bash

###################
# now easynode's addSourceDirectory only work for 'src' endwith, but module'll use the lib endwith
# so think it as a temporary solution to fix this problem.
###################

# first  compiled file or lib  as src

mv src src.backup
mv lib src

npm init

npm publish

mv src lib
mv src.backup src






