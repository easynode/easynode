var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function () {
    /**
     * Class Package
     *
     * @class netease.smartwatch.backend.models.Package
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Package extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super('watch_package', 'SELECT * FROM watch_package')
            //调用super()后再定义子类成员。
        }

        /**
         * 定义模型字段
         *
         * @method defineFields
         * @since 0.1.0
         * @author allen.hu
         * */
        defineFields () {
            this
                .defineField('version', 'string')
                .defineField('code', 'int')
                .defineField('email', 'string')
                .defineField('creator', 'string')
                .defineField('createtime', 'int')
            ;
        }


        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Package;
})();