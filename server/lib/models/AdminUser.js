/**************************************************************************************
 *                    .::::.
 *                  .::::::::.
 *                 ::::::::::: 
 *             ..:::::::::::'
 *           '::::::::::::'
 *             .::::::::::
 *        '::::::::::::::..
 *             ..::::::::::::.
 *           ``::::::::::::::::  在人间，有谁活着不像是一场炼狱 
 *            ::::``:::::::::'        .:::.
 *           ::::'   ':::::'       .::::::::.
 *         .::::'      ::::     .:::::::'::::.
 *        .:::'       :::::  .:::::::::' ':::::.
 *       .::'        :::::.:::::::::'      ':::::.
 *      .::'         ::::::::::::::'         ``::::.
 *  ...:::           ::::::::::::'              ``::.
 * ```` ':.          ':::::::::'                  ::::..
 *                    '.:::::'                    ':'````..
 * --------------- upup 后台管理用户Schema
 * ---------------- by yaohuitao@100tal.com
 * ----------------- 20180413
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
//mongoose.set('useFindAndModify', false);

var AdminUserSchema = new Schema({
    name: String, //用户名
    pwd: String, //密码
    avatar:String,//头像
    email:String, //邮箱
    isDisabled:{ type: Boolean, default: true }, //是否禁用
    creator:String,//创建者
    last_login_time:{ type: String, default: moment().format("YYYY-MM-DD HH:mm:ss") },//最近登录时间
    roles:Array,//所属角色列表
});

AdminUserSchema.set('toJSON', { getters: true, virtuals: true });
AdminUserSchema.set('toObject', { getters: true, virtuals: true });

// UserSchema.path('date').get(function (v) {
//     return moment(v).format("YYYY-MM-DD HH:mm:ss");
// });

var AdminUser = mongoose.model("AdminUser", AdminUserSchema);

module.exports = AdminUser;