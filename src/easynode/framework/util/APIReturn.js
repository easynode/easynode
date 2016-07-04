var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
    /**
     * Class APIReturn
     *
     * @class easynode.framework.util.APIReturn
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class APIReturn extends GenericObject {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super();
            //调用super()后再定义子类成员。
        }

        APIReturn(resCode = -1, resMsg = '', data = {} ){
            return {resCode:resCode, resMsg:resMsg, data:data};
        }

        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = APIReturn;
})();