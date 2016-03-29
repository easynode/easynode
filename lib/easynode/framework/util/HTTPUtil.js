'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var HTTPUtil = (function (_GenericObject) {
                _inherits(HTTPUtil, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function HTTPUtil() {
                        _classCallCheck(this, HTTPUtil);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(HTTPUtil).call(this));
                        //调用super()后再定义子类成员。
                }

                _createClass(HTTPUtil, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'rawPost',
                        value: function rawPost(url) {
                                var timeout = arguments.length <= 1 || arguments[1] === undefined ? 3000 : arguments[1];
                                var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                                var encoding = arguments.length <= 3 || arguments[3] === undefined ? 'utf8' : arguments[3];
                                var headers = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
                                var agent = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];

                                return regeneratorRuntime.mark(function _callee() {
                                        var options, _doRequest, fnRequest;

                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        _doRequest = function _doRequest(cb) {
                                                                                var req = http.request(options, function (res) {});
                                                                                req.on('socket', function (socket) {
                                                                                        socket.setTimeout(timeout);
                                                                                        socket.on('data', function (data) {
                                                                                                //logger.error(data.toString('hex'));
                                                                                                cb && cb(null, data.toString('hex'));
                                                                                        });
                                                                                        EasyNode.DEBUG && logger.debug('write http body string -> ' + data);
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
                                                                        };

                                                                        if (typeof data != 'string') {
                                                                                data = querystring.stringify(data);
                                                                        }
                                                                        headers = headers || {};
                                                                        //headers['User-Agent'] = 'Node.js EasyNode easynode.framework.util.HTTPUtil';
                                                                        options = URL.parse(url);

                                                                        options.method = 'POST';
                                                                        options.headers = headers;
                                                                        options.agent = agent;
                                                                        EasyNode.DEBUG && logger.debug('request http service [RAW MODE] -> ' + url);
                                                                        EasyNode.DEBUG && logger.debug('post body -> ' + data);
                                                                        fnRequest = thunkify(_doRequest);
                                                                        _context.next = 12;
                                                                        return fnRequest.call(null);

                                                                case 12:
                                                                        return _context.abrupt('return', _context.sent);

                                                                case 13:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
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

                }, {
                        key: 'getJSON',
                        value: function getJSON(url) {
                                var timeout = arguments.length <= 1 || arguments[1] === undefined ? 3000 : arguments[1];
                                var method = arguments.length <= 2 || arguments[2] === undefined ? 'GET' : arguments[2];
                                var data = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
                                var encoding = arguments.length <= 4 || arguments[4] === undefined ? 'utf8' : arguments[4];
                                var headers = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];
                                var agent = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

                                return regeneratorRuntime.mark(function _callee2() {
                                        var qs, options, _doRequest, fnRequest;

                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        _doRequest = function _doRequest(cb) {
                                                                                var req = http.request(options, function (res) {
                                                                                        var err = null;
                                                                                        res.setEncoding(encoding);
                                                                                        var _data = "";
                                                                                        res.on('data', function (chunk) {
                                                                                                _data += chunk;
                                                                                        });
                                                                                        res.on('end', function () {
                                                                                                EasyNode.DEBUG && logger.debug('http request [' + url + '] response -> ' + _data);
                                                                                                if (res.statusCode != 200) {
                                                                                                        cb && cb(new Error('http request [' + url + '] error : ' + res.statusCode));
                                                                                                        return;
                                                                                                }
                                                                                                var o = null;
                                                                                                try {
                                                                                                        o = JSON.parse(_data);
                                                                                                } catch (e) {
                                                                                                        logger.error('Invalid JSON response from url [' + url + '] ->\n' + _data);
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
                                                                                        EasyNode.DEBUG && logger.debug('write http body string -> ' + qs);
                                                                                        req.write(qs + '\n');
                                                                                }
                                                                                req.end();
                                                                        };

                                                                        qs = querystring.stringify(data);

                                                                        if (method.toLowerCase() == 'get') {
                                                                                if (qs) {
                                                                                        if (url.match(/^.*\?.*$/)) {
                                                                                                url += '&' + qs;
                                                                                        } else {
                                                                                                url += '?' + qs;
                                                                                        }
                                                                                }
                                                                        } else {
                                                                                url = url.replace(/\?.*$/, '');
                                                                        }
                                                                        headers = headers || {};
                                                                        headers['User-Agent'] = 'Node.js EasyNode easynode.framework.util.HTTPUtil';
                                                                        options = URL.parse(url);

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
                                                                        fnRequest = thunkify(_doRequest);
                                                                        _context2.next = 15;
                                                                        return fnRequest.call(null);

                                                                case 15:
                                                                        return _context2.abrupt('return', _context2.sent);

                                                                case 16:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }
                }]);

                return HTTPUtil;
        })(GenericObject);

        module.exports = HTTPUtil;
})();