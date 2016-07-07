'use strict';
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function () {
    /**
     * Class User
     *
     * @class netease.monitor.backend.models.User
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class User extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super(`monitor_user`, 'SELECT * FROM monitor_user');
            // 调用super()后再定义子类成员。
        }

        /**
         * 定义模型字段
         *
         * @method defineFields
         * @since 0.1.0
         * @author allen.hu
         * */
        defineFields() {
            this
                .defineField('id', 'int')
                .defineField('account', 'string')
                .defineField('accountid', 'string')
                .defineField('email', 'string')
                .defineField('phonenumber', 'string')
                .defineField('salt', 'string')
                .defineField('passwordsha', 'string')
                .defineField('createtime', 'int')
                .defineField('updatetime', 'int')
            ;
        }


        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = User;
})();
