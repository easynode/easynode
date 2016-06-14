var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function () {
    /**
     * Class Program
     *
     * @class netease.smartwatch.backend.models.Program
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Program extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super('watch_program', 'SELECT * FROM watch_program')
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
                .defineField('pkgid', 'int')
                .defineField('type', 'int')
                .defineField('size', 'int')
                .defineField('version', 'string')
                .defineField('code', 'int')
                .defineField('description', 'string')
                .defineField('enablediff', 'int')
                .defineField('blocksize', 'int')
                .defineField('sequence', 'int')
                .defineField('md5', 'string')
                .defineField('url', 'string')
                .defineField('email','string')
            ;
        }

        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Program;
})();