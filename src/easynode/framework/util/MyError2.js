/**
 * Created by hujiabao on 8/19/15.
 */
class MyError extends Error{
    constructor(obj={code:0,msg:"success"}){
        super();
        this.code = obj.code;
        this.message = obj.msg;
    }
}