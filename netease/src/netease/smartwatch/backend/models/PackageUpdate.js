var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function () {
    /**
     * Class ProgramDiff
     *
     * @class netease.smartwatch.backend.models.PackageUpdate
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class PackageUpdate extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super('watch_package_update', 'SELECT * FROM watch_package_update')
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
                .defineField('srcpkgid', 'int')
                .defineField('topkgid', 'int')
                .defineField('size', 'int')
                .defineField('md5', 'string')
                .defineField('url', 'string')
            ;
        }

        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = PackageUpdate;
})();