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
 * ---------------- by 578999047@qq.com
 * ----------------- 20190519
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

let AdminRole = require('./AdminRole');
//mongoose.set('useFindAndModify', false);

var AdminUserSchema = new Schema({
    name: String, //用户名 用于登录
    nickname:String, //昵称
    pwd: String, //密码
    avatar:String,//头像
    state:{ type: Number, default: 1 }, // 用户状态 -1：删除，1：正常，0：禁用
    creator:String,//创建者
    last_login_time:String,//最近登录时间
    role:{type:String,default:""},//管理员
    creat_time:{ type: String, default: moment().format("YYYY-MM-DD HH:mm:ss") },//创建时间
    roleid: { type: Schema.Types.ObjectId, ref: 'AdminRole' }
});

AdminUserSchema.set('toJSON', { getters: true, virtuals: true });
AdminUserSchema.set('toObject', { getters: true, virtuals: true });

// UserSchema.path('date').get(function (v) {
//     return moment(v).format("YYYY-MM-DD HH:mm:ss");
// });

var AdminUser = mongoose.model("AdminUser", AdminUserSchema);

module.exports = AdminUser;