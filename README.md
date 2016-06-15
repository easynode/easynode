# Introduction

Easynode is a framework for microservice written with es6 and integrated a light web service based on koa and a light tcp servic based on native socket. You can utilize all feature characters of ES6 in the framework.

## General Purpose

Our general purpose is to code with a synchronized way but run in an asynchronous way  for the web project written Node.JS.

<br>
<br>
<img src="https://raw.githubusercontent.com/nhipster/nhipster.github.io/master/images/easynode_dev_run.png" width="800"/>
<br>
<br>


## Code Fragement

### Class is the First-Citizen

EasyNode follows the object oriented programming method. The first citizen is the class not the funciton.  all classes extend GenericObject. Below is the class template.

```
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class ${NAME}
         *
         * @class #NAMESPACE#.${NAME}
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author ${AUTHOR}
         * */
        class ${NAME} extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author ${AUTHOR}
                 * */
                constructor () {
                        super();
                        //调用super()后再定义子类成员。
                }

                getClassName () {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = ${NAME};
})();
```

## Namespace

The organization structure of this directory is as similar as to organize in the Java programming language that the directory path as the namespace of the class. You can declare a class and create a object like below:

```
var Package = using('netease.smartwatch.backend.models.Package');
var model = new Package();
```
<br>
<img src="https://raw.githubusercontent.com/nhipster/nhipster.github.io/master/images/directory_structure.png" width="800"/>
<br>

## How can you develop with easynode?

With the following references. you will're familiarize with the development process in easynode quickly. The details can been seen in the [EasyNode Home](https://easynode.github.io)

## Contributors

* NetEase, Inc. (@NetEase)
* hujb2000[hujb2000@163.com]
* zlbbq[zlbbq@qq.com]


## Community

* If you find bugs or have suggestions, please feel free to open [an issue](https://github.com/easynode/easynode/issues)

* Ask any questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/easynode) with tag `easynode`.


## Contribute

Waiting....

## LICENSE

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

