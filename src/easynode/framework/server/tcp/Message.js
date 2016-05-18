var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');

(function () {
        /**
         * Class Message
         *
         * @class easynode.framework.server.tcp.Message
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class Message extends GenericObject {
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

                /**
                 * 从消息结构数组创建消息JSON对象。
                 * //结构示范：
                 * return [
                 'startFlag:BYTE',
                 'frameLen:WORD',
                 'sumCheck:WORD',
                 'msgId:WORD',
                 'msgVersion:BYTE',
                 'encrypt:BYTE',
                 'IMEI:STRING:16',
                 '$dynamic:getBodyStruct',
                 'bitField:BIT:BIT($msgId,1)',
                 'bitField2:BIT:BIT($msgId,1,2)',
                 'endFlag:BYTE',
                 'dynamicLen:BYTES:LENGTH($frameLen)'
                 ];
                 *
                 *
                 * @method createFromStructDescription
                 * @param {Object} dynamicSrc dynamic执行时的源对象
                 * @param {Array} struct 消息结构数组
                 * @param {Object} dynamic 动态参数处理器
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createFromStructDescription(dynamicSrc, struct, dynamic = {}) {
                        var length = 0;
                        var dynamicLengthRegExp = /^LENGTH\(\$(.*)\)$/;
                        var msg = {};

                        function __create(s) {
                                for (var loop = 0; loop < s.length; loop++) {
                                        var field = s[loop];
                                        var [name, type, exp] = field.split(':');
                                        name = S(name).trim().toString();
                                        type = S(type).trim().toString();
                                        exp = exp || '';
                                        exp = S(exp).trim().toString();
                                        if(dynamicLengthRegExp.test(exp)) {
                                                var _referField = dynamicLengthRegExp.exec(exp)[1];
                                                exp = msg[_referField];
                                                if(exp == null) {
                                                        throw new Error(`Invalid struct definition, field [${_referField}] is not found`);
                                                }
                                                exp = '' + exp;         //convert to string
                                        }
                                        if (name == '$dynamic') {
                                                var subStruct = dynamic[type].call(null, dynamicSrc);
                                                __create(subStruct);
                                        }
                                        else {
                                                switch (type.toUpperCase()) {
                                                        case 'STRING':
                                                        {
                                                                msg[name] = '';
                                                                length += parseInt(exp);
                                                                break;
                                                        }
                                                        case 'BYTE':
                                                        {
                                                                msg[name] = 0;
                                                                length += 1;
                                                                break;
                                                        }
                                                        case 'BIT':
                                                        {
                                                                msg[name] = 0;
                                                                break;
                                                        }
                                                        case 'WORD':
                                                        {
                                                                msg[name] = 0;
                                                                length += 2;
                                                                break;
                                                        }
                                                        case 'DWORD':
                                                        {
                                                                msg[name] = 0;
                                                                length += 4;
                                                                break;
                                                        }
                                                        case 'BYTES':
                                                        {
                                                                var len = parseInt(exp);
                                                                var arr = [];
                                                                for (var i = 0; i < len; i++) {
                                                                        arr.push(0);
                                                                }
                                                                msg[name] = arr;
                                                                length += parseInt(exp);
                                                                break;
                                                        }
                                                        case 'FLOAT':
                                                        {
                                                                msg[name] = 0.0;
                                                                length += 4;
                                                                break;
                                                        }
                                                        case 'DOUBLE':
                                                        {
                                                                msg[name] = 0.0;
                                                                length += 8;
                                                                break;
                                                        }
                                                        default :
                                                        {
                                                                throw new Error(`Unknown type [${type}] of field [${name}]`);
                                                        }
                                                }
                                        }
                                }
                        }

                        __create(struct);
                        return {
                                msg : msg,
                                length : length
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = Message;
})();