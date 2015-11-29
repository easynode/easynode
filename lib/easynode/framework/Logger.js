'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log4js = require('log4js');
var assert = require('assert');
var fs = require('fs');
var S = require('string');
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * EasyNode日志类。这是一个单例类，请使用它的静态函数，不要实例化它。<br>
         * Logger是结合配置文件定义的appender和log level使用的，参考：etc/EasyNode.conf。<br>
         * <h5>示例</h5>
         * <pre>
         *  var logger = using('easynode.framework.Logger').forFile(__filename);
         *  EasyNode.DEBUG && logger.debug('Hello, EasyNode');
         *  logger.info('Hello, EasyNode');
         *  logger.warn('Hello, EasyNode');
         *  logger.error('Hello, EasyNode');
         *  logger.fatal('Hello, EasyNode');
         *  </pre>
         *
         * @class easynode.framework.Logger
         * @extends easynode.GenericObject
         * @author hujiabao
         * @since 0.1.0
         * */

        /**
         *  静态实例
         *  @property   instance
         *  @private
         *  @static
         *  @author hujiabao
         *  @since 0.1.0
         * */
        var _instance = null;

        var Logger = (function (_GenericObject) {
                _inherits(Logger, _GenericObject);

                /**
                 * 构造函数，私有的，使用静态函数getLogger()获取Logger实例。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * @private
                 * */

                function Logger() {
                        _classCallCheck(this, Logger);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Logger).call(this));

                        assert(_instance == null, 'easynode.Logger is a singleton class,  use getLogger() instead of instantiation');

                        //initialize appenders
                        var appenders = [{
                                type: 'console'
                        }];
                        var logDirectory = EasyNode.config('easynode.logger.folder');
                        if (!fs.existsSync(EasyNode.real(logDirectory))) {
                                fs.mkdirSync(EasyNode.real(logDirectory));
                        }

                        var s = EasyNode.config('easynode.logger.appenders') || '';
                        s = s.split(',');
                        s.forEach(function (v) {
                                v = S(v).trim();
                                var appId = EasyNode.config('easynode.app.id', 'UNTITLED');
                                appId = appId == 'UNTITLED' ? '' : '.' + appId;
                                var appender = {
                                        type: 'dateFile',
                                        filename: EasyNode.real(logDirectory + '/' + EasyNode.config('easynode.logger.appender.' + v + '.file', v + '.log') + appId),
                                        pattern: EasyNode.config('easynode.logger.appender.' + v + '.pattern'),
                                        maxLogSize: parseInt(EasyNode.config('easynode.logger.appender.' + v + '.maxSize')),
                                        alwaysIncludePattern: false,
                                        backups: parseInt(EasyNode.config('easynode.logger.appender.' + v + '.backup')),
                                        category: EasyNode.config('easynode.logger.appender.' + v + '.namespace') || v
                                };
                                appenders.push(appender);
                        });
                        log4js.configure({
                                appenders: appenders,
                                replaceConsole: true
                        });
                        return _this;
                }

                _createClass(Logger, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }

                        /**
                         * 获取一个Logger实例。Logger实例具有debug、info、warn、error、fatal五个函数，对应DEBUG、INFO、WARN、ERROR、FATAL五个日志级别。<br>
                         *  <h5>Logger配置</h5>
                         *  <pre>
                         *  // appenders
                         *  easynode.logger.appenders=root,access
                         *  // root appender
                         *  easynode.logger.appender.root.level=DEBUG
                         *  easynode.logger.appender.root.file = app.log
                         *  easynode.logger.appender.root.pattern=_yyyy-MM-dd
                         *  easynode.logger.appender.root.maxSize=1024
                         *  easynode.logger.appender.root.backup=10
                         *  // access appender
                         *  easynode.logger.appender.root.level=DEBUG
                         *  easynode.logger.appender.root.file = access.log
                         *  easynode.logger.appender.root.pattern=_yyyy-MM-dd
                         *  easynode.logger.appender.root.maxSize=1024
                         *  easynode.logger.appender.root.backup=10
                         *  </pre>
                         *
                         * @method getLogger
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * @param {String} name Logger名称，默认'root'。
                         * @return {Logger} Logger实例。
                         * @example
                         *      var logger = using('easynode.framework.Logger').getLogger();
                         *      EasyNode.DEBUG && logger.debug('Hello, EasyNode');
                         *      logger.info('Hello, EasyNode');
                         *      logger.warn('Hello, EasyNode');
                         *      logger.error('Hello, EasyNode');
                         *      logger.fatal('Hello, EasyNode');
                         * @example
                         *      // 写access日志
                         *      var logger = using('easynode.framework.Logger').getLogger('access');
                         *      EasyNode.DEBUG && logger.debug('Hello, EasyNode');
                         *      logger.info('Hello, EasyNode');
                         *      logger.warn('Hello, EasyNode');
                         *      logger.error('Hello, EasyNode');
                         *      logger.fatal('Hello, EasyNode');
                         * */

                }], [{
                        key: 'getLogger',
                        value: function getLogger() {
                                var name = arguments.length <= 0 || arguments[0] === undefined ? 'root' : arguments[0];

                                var logger = log4js.getLogger(name);
                                var l = EasyNode.config('easynode.logger.appender.' + name + '.' + 'level') || EasyNode.config('easynode.logger.level');
                                l && logger.setLevel(l);
                                //TODO AOP debug
                                return logger;
                        }

                        /**
                         * 获取指定文件名的Logger，它是Logger.getLogger()函数的语法糖，参考getLogger。
                         *
                         * @method forFile
                         * @since 0.1.0
                         * @author hujiabao
                         * @static
                         * @param {String} name 请始终传递__filename
                         * @return {Logger} Logger实例。
                         * @example
                         *      var logger = using('easynode.framework.Logger').forFile(__filename);
                         *      EasyNode.DEBUG && logger.debug('Hello, EasyNode');
                         *      logger.info('Hello, EasyNode');
                         *      logger.warn('Hello, EasyNode');
                         *      logger.error('Hello, EasyNode');
                         *      logger.fatal('Hello, EasyNode');
                         * */

                }, {
                        key: 'forFile',
                        value: function forFile(file) {
                                assert(typeof file == 'string', 'Not a String');
                                if (file.match(/.*\/src\/.*/)) {
                                        var ns = EasyNode.namespace(file);
                                        return Logger.getLogger(ns);
                                } else {
                                        return Logger.getLogger(file.replace(/.*\//gm, ''));
                                }
                        }
                }]);

                return Logger;
        })(GenericObject);

        //实例化单例对象。

        _instance = new Logger();

        module.exports = Logger;
})();