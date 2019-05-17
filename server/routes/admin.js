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
 * --------------- 管理系统接口
 * ---------------- by taozi 578999047@qq.com
 * ----------------- 20190515
 * -------- 待优化 ---------
 * JWT续期，JWT登出
 * -------------------------
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var express = require('express');
var router = express.Router();
const {
    AdminUserControl,
} = require('../lib/controller');
const { setting,creatRes } = require('../utils');

var jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
    //不鉴权的JWT
    let whiteRouters = ['/admin/time','/admin/user/login'];
    if (whiteRouters.indexOf(req.originalUrl) >= 0) {
        return next();
    }
    //定义 用token的api  对其验证
    var token = req.headers["authorization"];
    jwt.verify(token, setting.encrypt_key, function(err, decoded) {
        if(err){
            res.json(creatRes("jsonWebTokenError"));
            return;
        }else{
            req.user = decoded.user;
            console.log(req.session.uid)
            return next();
        }
    });
});
/**
* 获取服务器时间
*/
router.post('/time', (req, res) => res.json({time:new Date().getTime()}) );
/**
* 用户相关
*/
router.post('/user/login', AdminUserControl.loginByName );
router.post('/user/logout', AdminUserControl.logOut );
router.post('/user/add', AdminUserControl.addUserFn );
router.post('/user/getinfo', AdminUserControl.getUserInfo );


module.exports = router;