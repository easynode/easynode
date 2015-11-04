var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var thunkify = require('thunkify');
var http = require('http');
var URL = require('url');
var _ = require('underscore');
var querystring = require('querystring');

(function () {
        /**
         * Class HTTPUtil
         *
         * @class easynode.framework.util.HTTPUtil
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class HTTPUtil extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                }

                static rawPost(url, timeout = 3000, data = {}, encoding = 'utf8', headers = {}, agent = false) {
                        return function * () {
                                if(typeof data != 'string') {
                                        data = querystring.stringify(data);
                                }
                                headers = headers || {};
                                //headers['User-Agent'] = 'Node.js EasyNode easynode.framework.util.HTTPUtil';
                                var options = URL.parse(url);
                                options.method = 'POST';
                                options.headers = headers;
                                options.agent = agent;
                                EasyNode.DEBUG && logger.debug('request http service [RAW MODE] -> ' + url);
                                EasyNode.DEBUG && logger.debug('post body -> ' + data);
                                function _doRequest(cb) {
                                        var req = http.request(options, function (res) {
                                        });
                                        req.on('socket', function(socket) {
                                                socket.setTimeout(timeout);
                                                socket.on('data', function(data) {
                                                        //logger.error(data.toString('hex'));
                                                        cb && cb(null, data.toString('hex'));
                                                });
                                                EasyNode.DEBUG && logger.debug(`write http body string -> ${data}`);
                                                socket.write(data + '\n');
                                        });
                                        req.setTimeout(timeout, function () {
                                                req.abort();
                                                cb && cb(new Error('Timeout - ' + url));
                                        });
                                        req.on('error', function (err) {
                                                //logger.error('111111');
                                                //cb && cb(err);
                                        });
                                }

                                var fnRequest = thunkify(_doRequest);
                                return yield fnRequest.call(null);
                        };
                }

                /**
                 * 请求JSON接口。
                 *
                 * @method getJSON
                 * @param {String} url 请求URL
                 * @param {int} timeout 超时时间(ms)，默认3秒
                 * @param {String} method HTTP Method，默认GET
                 * @param {Object} data 请求参数
                 * @param {String} encoding 字符集，默认utf8
                 * @param {Object} headers HTTP请求头
                 * @param {Object/boolean} agent HTTP agent，默认false，不使用node.js的连接池
                 * @return {Object} 远程HTTP接口响应的JSON对象
                 * @async
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static  getJSON(url, timeout = 3000, method = 'GET', data = {}, encoding = 'utf8', headers = {}, agent = false) {

                        return function *() {
                                var qs = querystring.stringify(data);
                                if (method.toLowerCase() == 'get') {
                                        if (qs) {
                                                if (url.match(/^.*\?.*$/)) {
                                                        url += '&' + qs;
                                                }
                                                else {
                                                        url += '?' + qs;
                                                }
                                        }
                                }
                                else {
                                        url = url.replace(/\?.*$/, '');
                                }
                                headers = headers || {};
                                headers['User-Agent'] = 'Node.js EasyNode easynode.framework.util.HTTPUtil';
                                var options = URL.parse(url);
                                options.method = method;
                                options.headers = headers;
                                if (method.toLowerCase() == 'post') {
                                        _.extend(options.headers, {
                                                "Content-Type": 'application/x-www-form-urlencoded',
                                                "Content-Length": qs.length
                                        });
                                }
                                options.agent = agent;
                                EasyNode.DEBUG && logger.debug('request http service -> ' + url);
                                EasyNode.DEBUG && method.toLowerCase() == 'post' && logger.debug('post body -> ' + JSON.stringify(data));
                                function _doRequest(cb) {
                                        var req = http.request(options, function (res) {
                                                var err = null;
                                                res.setEncoding(encoding);
                                                var _data = "";
                                                res.on('data', function (chunk) {
                                                        _data += chunk;
                                                });
                                                res.on('end', function () {
                                                        EasyNode.DEBUG && logger.debug(`http request [${url}] response -> ${_data}`);
                                                        if (res.statusCode != 200) {
                                                                cb && cb(new Error('http request [' + url + '] error : ' + res.statusCode));
                                                                return;
                                                        }
                                                        var o = null;
                                                        try {
                                                                o = JSON.parse(_data);
                                                        } catch (e) {
                                                                logger.error(`Invalid JSON response from url [${url}] ->\n` + _data);
                                                                err = e;
                                                        }
                                                        cb && cb(err, o);
                                                });
                                                req.on('error', function (e) {
                                                        cb && cb(e);
                                                });
                                        });
                                        req.setTimeout(timeout, function () {
                                                req.abort();
                                                cb(new Error('Timeout - ' + url));
                                        });
                                        req.on('error', function (err) {
                                                cb && cb(err);
                                        });
                                        if (method.toLowerCase() == 'post') {
                                                EasyNode.DEBUG && logger.debug(`write http body string -> ${qs}`);
                                                req.write(qs + '\n');
                                        }
                                        req.end();
                                }

                                var fnRequest = thunkify(_doRequest);
                                return yield fnRequest.call(null);
                        }
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = HTTPUtil;
})();