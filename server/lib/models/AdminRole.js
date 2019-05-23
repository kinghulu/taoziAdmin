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
 * --------------- upup 后台权限Schema
 * ---------------- by 578999047@qq.com
 * ----------------- 20190521
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
//mongoose.set('useFindAndModify', false);

var AdminRoleSchema = new Schema({
    name: String, //权限名
    state:{ type: Number, default: 1 }, // 角色状态 -1：删除，1：正常，0：禁用
    creator:String,//创建者
    creator_id:String, //创建者id
    rules:String,  //权限列表字符串
    create_time:{ type: String, default: moment().format("YYYY-MM-DD HH:mm:ss") },//创建时间
});

AdminRoleSchema.set('toJSON', { getters: true, virtuals: true });
AdminRoleSchema.set('toObject', { getters: true, virtuals: true });

// UserSchema.path('date').get(function (v) {
//     return moment(v).format("YYYY-MM-DD HH:mm:ss");
// });

var AdminRole = mongoose.model("AdminRole", AdminRoleSchema);

module.exports = AdminRole;