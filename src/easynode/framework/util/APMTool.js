var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var HTTPUtil = using('easynode.framework.util.HTTPUtil');
var crypto = require('crypto');

(function () {
        const EASYNODE_APM_APP_ID = EasyNode.config('easynode.services.apm.appId');
        const EASYNODE_APM_APP_KEY = EasyNode.config('easynode.services.apm.appKey');
        const EASYNODE_APM_SERVICE_URL = EasyNode.config('easynode.services.apm.url', 'http://apm-post.easynode.org');
        const EASYNODE_APM_SERVICE_TIMEOUT = parseInt(EasyNode.config('easynode.services.apm.timeout', '3000'));

        /**
         * Class APMTool
         *
         * @class easynode.framework.util.APMTool
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class APMTool extends GenericObject {
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
                 * 发送APM数据至easynode APM平台。
                 *
                 * @method post
                 * @param {String} apmString apm对象的JSON序列化字符串
                 * @async
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static post(apmString) {
                        return function * () {
                                assert(EASYNODE_APM_APP_ID, 'Invalid application id');
                                assert(EASYNODE_APM_APP_KEY, 'Invalid application key');
                                try {
                                        var encryptAMPString = APMTool.encryptAES_256_ECB(apmString, EASYNODE_APM_APP_KEY);
                                        console.log('3')
                                        console.log(apmString);
                                        var data = {
                                                appId: EASYNODE_APM_APP_ID,
                                                apmData: encryptAMPString                              //经aes-256-ecb加密的JSON字符串，解密后JSON.parse即得到原对象
                                        };
                                        yield HTTPUtil.getJSON(EASYNODE_APM_SERVICE_URL, EASYNODE_APM_SERVICE_TIMEOUT, 'POST', data);
                                }catch(err) {
                                        console.log(err);
                                        logger.error(`***APM POST FAIL*** ${apmString}`);
                                }
                        };
                }

                /**
                 * 使用AES_256_ECB加密发送至easynode APM平台的数据。
                 *
                 * @method encryptAES_256_ECB
                 * @param {String} apmString apm对象的JSON序列化字符串
                 * @param {String} key 加密密钥(32位)
                 * @async
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static encryptAES_256_ECB(apmString, key) {
                        var crypto = require('crypto');
                        var clearEncoding = 'utf8';
                        var algorithm = 'aes-256-ecb';
                        var iv = "";
                        var cipherEncoding = 'hex';
                        var cipher = crypto.createCipheriv(algorithm, key, iv);
                        cipher.setAutoPadding(true);

                        var enc = cipher.update(apmString, clearEncoding, cipherEncoding);
                        enc += cipher.final(cipherEncoding);
                        return enc;
                }

                /**
                 * 使用AES_256_ECB解密APM数据字符串。
                 *
                 * @method decryptAES_256_ECB
                 * @param {String} apmString 经encryptAES_256_ECB加密的JSON序列化字符串
                 * @param {String} key 加密密钥(32位)
                 * @async
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static decryptAES_256_ECB(apmString, key) {
                        var crypto = require('crypto');
                        var clearEncoding = 'utf8';
                        var algorithm = 'aes-256-ecb';
                        var iv = "";
                        var cipherEncoding = 'hex';
                        var decipher = crypto.createDecipheriv(algorithm, key, iv);
                        var dec = decipher.update(cipherChunks[i], cipherEncoding, clearEncoding);
                        dec += decipher.final(clearEncoding);
                        return dec;
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = APMTool;
})();