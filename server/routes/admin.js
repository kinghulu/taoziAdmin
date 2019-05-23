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
const { setting,creatRes,checkSign,tools } = require('../utils');

var jwt = require('jsonwebtoken');
//校验用户身份
router.use(function(req, res, next) {
    //不鉴权的JWT
    let whiteRouters = ['/admin/user/login'];
    if (whiteRouters.indexOf(req.originalUrl) >= 0) {
        return next();
    }
    //定义 用token的api  对其验证
    var token = req.headers["authorization"];
    if(req.method == "OPTIONS"){
        return next();
    }else{
        jwt.verify(token, setting.encrypt_key, function(err, decoded) {
            if(err){
                res.json(creatRes("jsonWebTokenError"));
                return;
            }else{
                req.user = decoded.user;
                if(tools.md5(setting.SECERT+req.user.id) != req.session.uid){
                    res.json(creatRes("jsonWebTokenError"));
                    return;
                }else{
                    return next();
                }
            }
        });
    }
});

//校验sign签名
router.use(checkSign);

/**
* 用户相关
*/
router.post('/user/login', AdminUserControl.loginByName );
router.post('/user/logout', AdminUserControl.logOut );
router.post('/user/add', AdminUserControl.addUserFn );
router.post('/user/getinfo', AdminUserControl.getUserInfo );
router.post('/user/editpassword', AdminUserControl.postEditUserPassword );
router.post('/user/list', AdminUserControl.getUserList );
router.post('/user/changestate', AdminUserControl.changeUserState );
router.post('/user/detail', AdminUserControl.getUserDetail );
router.post('/user/update', AdminUserControl.updateUserById );

router.post('/role/add', AdminUserControl.addRoles );
router.post('/role/list', AdminUserControl.getRoleList );
router.post('/role/changestate', AdminUserControl.changeRoleState );
router.post('/role/detail', AdminUserControl.getRoleDetail );
router.post('/role/update', AdminUserControl.updateRoleById );



module.exports = router;