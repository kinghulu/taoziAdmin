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
 * --------------- 定义接口格式返回
 * ---------------- by taozi 578999047@qq.com
 * ----------------- 20190517
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/

let carr = {
    'success':{ code : 20000, msg:"成功"},
    'fail':{ code : 20001, msg:"操作失败，请重试"},
    'jsonWebTokenError':{ code : 30001, msg:"验证身份失败，请重新登录！"},
    'userLoginError':{ code : 30002, msg:"用户名或密码错误！"},
    'noPermission':{ code : 30003, msg:"没有权限"},
    'pageNotFound':{ code : 40001, msg:"接口不见了！"},
    'findAnError':{ code : 40002, msg:"发现八阿哥！"},
};
 /**
 * 定义接口返回
 * @ statusname 成功/失败类型名字 如 success  
 * @ data 返回数据  
 * @ msg 自定义消息
 */
module.exports =  (statusname="success",data='',msg='')=>{
    return {
        code:carr[statusname].code,
        data:data,
        msg:msg?msg:carr[statusname].msg,
    } 
}
