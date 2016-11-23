var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var AbstractServer = using('easynode.framework.server.AbstractServer');
var TCPClient = using('easynode.framework.server.tcp.TCPClient');
var S = require('string');
var _ = require('underscore');
var net = require('net');
var thunkify = require('thunkify');
var co = require('co');
var UUID = require('uuid');
var util = require('util');

(function() {
        /**
         * Class TCPServer
         *
         * @class easynode.framework.server.tcp.TCPServer
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class TCPServer extends AbstractServer {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {easynode.framework.server.tcp.ITCPDecoder} decoder 解码器, Optional
                 * @param {easynode.framework.server.tcp.ITCPEncoder} encoder 编码器, Optional
                 * @param {easynode.framework.server.tcp.IMessageHandler} messageHandler 消息处理器, Optional
                 * @param {int} port TCP监听端口，默认6000，配置项：easynode.servers.tcpServer.port, Optional
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(decoder = null, encoder = null, messageHandler = null, port = S(EasyNode.config('easynode.servers.tcpServer.port', '6000')).toInt()) {
      if (arguments.length == 1) {
        port = arguments[0];
        decoder = encoder = messageHandler = null;
      }
      super(port, EasyNode.config('easynode.servers.tcpServer.name', 'tcpServer'));
                        // 调用super()后再定义子类成员。

                        /**
                         *  客户端连接map，session id -> easynode.framework.server.tcp.TCPClient
                         *
                         * @property _clients
                         * @type Map(String -> easynode.framework.server.tcp.TCPClient)
                         * @private
                         *
                         * */
      this._clients = {};


                        /**
                         *  客户端别名，alias -> easynode.framework.server.tcp.TCPClient
                         *
                         * @property _clientAlias
                         * @type Map(String -> easynode.framework.server.tcp.TCPClient)
                         * @private
                         *
                         * */
      this._clientAlias = {};

                        /**
                         *  客户端连接数
                         *
                         * @property _clientsCount
                         * @type Object
                         * @private
                         *
                         * */
      this._clientsCount = 0;

                        /**
                         *  Decoder
                         *
                         * @property _decoder
                         * @type easynode.framework.server.tcp.ITCPDecoder
                         * @private
                         *
                         * */
      this._decoder = decoder;

                        /**
                         *  Encoder
                         *
                         * @property _encoder
                         * @type easynode.framework.server.tcp.ITCPEncoder
                         * @private
                         *
                         * */
      this._encoder = encoder;

                        /**
                         *  MessageHandler, 处理Decoder解码过的消息
                         *
                         * @property _messageHandler
                         * @type easynode.framework.server.tcp.IMessageHandler
                         * @private
                         *
                         * */
      this._messageHandler = messageHandler;

                        /**
                         *  指示TCP服务是否已经启动。
                         *
                         * @property _isRunning
                         * @type boolean
                         * @private
                         *
                         * */
      this._isRunning = false;

                        /**
                         *  客户端工厂类。
                         *
                         * @property _clientFactory
                         * @type class
                         * @default easynode.framework.server.tcp.TCPClient
                         * @private
                         *
                         * */
      this._clientFactory = using('easynode.framework.server.tcp.TCPClient');

                        /**
                         *  net.Server实例。
                         *
                         * @property _server
                         * @type net.Server
                         * @default null
                         * @private*
                         * */
      this._server = null;
    }

                /**
                 * 设置decoder。
                 *
                 * @method setDecoder
                 * @param {easynode.framework.server.tcp.ITCPDecoder} decoder 解码器
                 * @return this　可链式调用
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setDecoder(decoder) {
      assert(!this._isRunning, 'Can not change decoder while tcp server is running');
      this._decoder = decoder;
      return this;
    }

                /**
                 * 设置encoder。
                 *
                 * @method setEncoder
                 * @param {easynode.framework.server.tcp.ITCPEncoder} encoder 编码器
                 * @return this　可链式调用
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setEncoder(encoder) {
      assert(!this._isRunning, 'Can not change encoder while tcp server is running');
      this._encoder = encoder;
      return this;
    }

                /**
                 * 设置消息处理器。
                 *
                 * @method setEncoder
                 * @param {easynode.framework.server.tcp.IMessageHandler} messageHandler 消息处理器
                 * @return this　可链式调用
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setMessageHandler(messageHandler) {
      assert(!this._isRunning, 'Can not change message handler while tcp server is running');
      this._messageHandler = messageHandler;
      return this;
    }

                /**
                 * 设置client实例工厂。
                 *
                 * @method setClientFactory
                 * @param {String/class} namespace 客户端工厂全类名或客户端工厂类。该类要求继承于easynode.framework.server.tcp.TCPServer
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setClientFactory(namespace) {
      if (typeof namespace == 'string') {
        this._clientFactory = using(namespace);
      }
      else if (typeof namespace == 'function') {
        this._clientFactory = namespace;
      }
                        else {
        throw new Error('Invalid argument');
      }
    }

                /**
                 * 包装Socket。
                 *
                 * @method _encapsulateSocket
                 * @param {Socket} socket Socket实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    _encapsulateSocket(socket) {
      var me = this;
      socket.setTimeout(S(EasyNode.config('easynode.servers.tcpServer.socketTimeout', '3000')).toInt());
      socket.setNoDelay(true);
      socket.on('timeout', function() {
        me.disconnect(socket.SOCKET_ID, 'timeout');
      });

      socket.on('error', function(err) {
        logger.error(err);
        me.disconnect(socket.SOCKET_ID, 'error');
      });

      socket.on('close', function() {
        me.disconnect(socket.SOCKET_ID, 'close');
      });
    }

                /**
                 * 网络连接事件处理函数。
                 *
                 * @method _onClientConnect
                 * @param {Socket} socket Socket实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    _onClientConnect(socket) {
      var me = this;
      var id = UUID.v4();
      socket.SOCKET_ID = id;
      this._encapsulateSocket(socket);
      var client = new this._clientFactory(socket, this);
      this._clients[id] = client;
      this._clientsCount++;
      socket.encodeAndSend = function(msg, c) {
        var _client = c || client;
        if (me._encoder == null) {
          EasyNode.DEBUG && logger.debug('send default utf-8 string because of no encoder had been specified');
          if (typeof msg == 'object') {
            msg = JSON.stringify(msg);
          }
          socket.write(msg, 'utf-8');
          return msg;
        }
        else {
          var encoded = me._encoder.encode(msg, _client);
          if (encoded != null) {
                                                // assert(Buffer.isBuffer(encoded), `Invalid encoded type, not a Buffer`);
            if (Buffer.isBuffer(encoded)) {
              var hex = encoded.toString('hex');
              EasyNode.DEBUG && logger.debug(`send message to client [${client.getAlias() | client.getSocketId()}] : ${hex}`);
              socket.write(hex, 'hex');
              return hex;
            }
            else if (typeof encoded == 'string') {
              EasyNode.DEBUG && logger.debug(`send message to client [${client.getAlias() || client.getSocketId()}] : ${encoded}`);
              socket.write(encoded, 'hex');
              return encoded;
            }
                                                else {
              throw new Error('Invalid encoded result, not a Buffer or a HEX string');
            }
          }
        }
      };
      this._handleMessages(client);
      this._beginDecode(client);
      if (!this._encoder) {
        logger.error('no encoder specified, call setEncoder() to set one');
      }
      EasyNode.DEBUG && logger.debug(`client [${id}] connected`);
    }

                /**
                 * 设置客户端别名。
                 *
                 * @method setClientAlias
                 * @param {String} alias 客户端别名
                 * @param {easynode.framework.server.tcp.TCPClient} client 客户端实例，具体类型取决于ClientFactory
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setClientAlias(alias, client) {
      var oldClient = this._clientAlias[alias];
      if (oldClient) {
        this.disconnect(oldClient.getSocketId(), 'duplicated alias');
      }
      client.setAlias(alias);
      this._clientAlias[alias] = client;
    }

                /**
                 * 根据客户端别名查找客户端实例
                 *
                 * @method getClientByAlias
                 * @param {String} alias 客户端别名
                 * @return {easynode.framework.server.tcp.TCPClient} 客户端实例，具体类型取决于ClientFactory
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getClientByAlias(alias) {
      return this._clientAlias[alias];
    }

                /**
                 * 获取当前的客户端连接总数。
                 *
                 * @method getClientsCount
                 * @return {int} 客户端总数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getClientsCount() {
      return this._clientsCount;
    }

                /**
                 * 断开连接。
                 *
                 * @method disconnect
                 * @param {String} socketId client.getId()或client.getSocketId()或socket.SOCKET_ID
                 * @param {String} reason 断开原因
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    disconnect(socketId, reason) {
      if (this._clients[socketId]) {
        var client = this._clients[socketId];
        var alias = client.getAlias();
        EasyNode.DEBUG && logger.debug(`client [${socketId}] disconnected by reason [${reason}]`);
        delete this._clients[socketId];
        this._clientsCount --;
        if (alias) {
          delete this._clientAlias[alias];
        }
        client.getSocket().destroy();
      }
    }

    _beginDecode(client) {
      if (!this._decoder) {
        logger.error('no decoder specified, call setDecoder() to set one');
        return;
      }
      this._decoder.decode(client);
    }

    _handleMessages(client) {
      var me = this;
      if (!this._messageHandler) {
        logger.error('no message handler specified, call setMessageHandler() to set one');
        return;
      }
      client.on(TCPClient.EVENT_MESSAGE_DECODED, function(msg) {
        co(function *() {
          var responses = yield me._messageHandler.handleMessage(msg, client);
          var msgSent = [];

          if (responses) {
            if (util.isArray(responses)) {
              responses.forEach((msg) => {
                msgSent.push(client.getSocket().encodeAndSend(msg, client));
              });
            }
            else {
              msgSent.push(client.getSocket().encodeAndSend(responses, client));
            }
          }
          process.nextTick(function() {
            client.trigger(TCPClient.EVENT_MESSAGE_HANDLED, msg, responses, msgSent);
          });
        }).catch(function(err) {
          logger.error(err);
        });
      });
    }

    stop() {
      var me = this;
      me.trigger(AbstractServer.EVENT_BEFORE_STOP);
      return function *() {
        me._server.close();
        me._isRunning = false;
        me.trigger(AbstractServer.EVENT_STOP);
      };
    }

    start() {
      var me = this;
      me.trigger(AbstractServer.EVENT_BEFORE_START);
      return function *() {
        var server = me._server = net.createServer(function(socket) {
          me._onClientConnect(socket);
        });

        server.on('error', function(e) {
          logger.error(e);
          if (e.code == 'EADDRINUSE') {
            process.exit(-1);
          }
          co(function *() {
            yield me.stop();
          }).catch(function(err) {
            logger.error(err);
          });
        });

        server.on('listening', function() {
          me._isRunning = true;
        });

        var fnListen = thunkify(server.listen);
        yield fnListen.call(server, me.port);
        logger.info(`[${me.name}] is listening on port [${me.port}]...`);
        me.trigger(AbstractServer.EVENT_STARTED);
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = TCPServer;
})();
