var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var Decoder = using('easynode.framework.server.tcp.Decoder');
var TCPClient = using('easynode.framework.server.tcp.TCPClient');

(function () {
        /**
         * Class JSONDecoder
         *
         * @class easynode.framework.server.tcp.protocols.JSONDecoder
         * @extends easynode.framework.server.tcp.Decoder
         * @since 0.1.0
         * @author hujiabao
         * */
        class JSONDecoder extends Decoder {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(server, encoding='utf8') {
                        super(server);
                        //调用super()后再定义子类成员。
                        this.encoding = encoding;
                }

                decode(client) {
                        var socket = client.getSocket();
                        var me = this;
                        socket.setEncoding(this.encoding);
                        var r = false;
                        var line = false;
                        client.recvBuf = '';
                        socket.on('readable', function() {
                                while(true) {
                                        var s = socket.read(1);
                                        if(s == null) {
                                                break;
                                        }
                                        var code = s.charCodeAt(0);
                                        client.recvBuf += s;
                                        if (!r) {
                                                if (code == 0x0D) {
                                                        r = true;
                                                }
                                        }
                                        else {
                                                if (code == 0x0A) {
                                                        line = true;
                                                }
                                                r = false;
                                        }
                                        if (line) {              //received a line
                                                try {
                                                        var msg = JSON.parse(client.recvBuf);
                                                        if(msg && typeof msg == 'object') {
                                                                client.trigger(TCPClient.EVENT_MESSAGE_DECODED, msg);
                                                        }
                                                }catch(err){}
                                                line = false;
                                                client.recvBuf = '';
                                        }
                                }
                        });
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = JSONDecoder;
})();