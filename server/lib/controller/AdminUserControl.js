
const AdminUserModel = require("../models").AdminUser;
const {
    setting,tools,creatRes
} = require('../../utils');
var moment = require('moment');
var jwt = require('jsonwebtoken');

class AdminUserControl {
    constructor() {
        // super()
    }

    /**
    * - 登录功能
    * @uname - 用户名
    * @upass - 密码
    */
    async loginByName(req, res, next){
        const userObj = {
            name: req.body.name,
            //pwd: tools.md5(setting.SECERT+req.body.password),
            pwd: req.body.pwd
        }
        try{
            const user =await AdminUserModel.findOne(userObj);
            if (user) {
                //判断是否禁用
                if(user.isDisabled){
                    await AdminUserModel.findOneAndUpdate(userObj, { $set: {"last_login_time":moment().format("YYYY-MM-DD HH:mm:ss")}})
                    //有效期24小时
                    let _token = jwt.sign({user:{name:user.name,id:user.id},exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, setting.encrypt_key);
                    req.session.uid = user.id;
                    console.log(req.session.uid)
                    res.json(creatRes("success",{
                        token:_token,
                        uname:user.name,
                        avatar:user.avatar
                    }))
                }else{
                    res.json(creatRes('fail','',"该账号：" + user.name + "已被禁用，请联系管理员"));
                }
            }else{
                res.json(creatRes('userLoginError'));
            }
        }catch(e){
            res.json(creatRes('fail'));
        };
    }



    /**
    * - 获取用户信息
    * @token
    * @upass - 密码
    */
    async getUserInfo(req, res, next){
        res.json(creatRes("success",{a:"a",c:"ddsg"}));
        // const userObj = {
        //     name: req.body.name,
        //     //pwd: tools.md5(setting.SECERT+req.body.password),
        //     pwd: req.body.pwd
        // }
        // try{
        //     const user =await AdminUserModel.findOne(userObj);
        //     if (user) {
        //         //判断是否禁用
        //         if(user.isDisabled){
        //             await AdminUserModel.findOneAndUpdate(userObj, { $set: {"last_login_time":moment().format("YYYY-MM-DD HH:mm:ss")}})
        //             //req.session.loginUser = user;
        //             let _token = jwt.sign({data: user }, setting.encrypt_key, { expiresIn: 60 * 60 * 24 });
        //             res.json({
        //                 code:"1",
        //                 data:{
        //                     token:_token,
        //                     uname:user.name,
        //                     avatar:user.avatar
        //                 },
        //                 msg:"成功"
        //             });
        //         }else{
        //             res.json({
        //                 code:"0",
        //                 msg:"该账号：" + user.name + "已被禁用，请联系管理员"
        //             });
        //         }
        //     }else{
        //         res.json({code:"0",msg:"用户名或密码错误"});
        //     }
        // }catch(e){
        //     console.log(e)
        //     res.json({code:"0",msg:"失败，请重试"});
        // };
    }    

    async logOut(req, res, next) {
        try{
            req.session.destroy();
            res.json(creatRes());
        }catch(e){
            res.json(creatRes('fail'));
        };
    }
    /**
    * - 添加用户
    * @gid - 年级ID
    * @jid - 季节ID(1,2,3,4)
    * @cid - 讲次ID
    */
   async addUserFn(req, res, next) {
        let f_name = req.body.name;
        let f_email = req.body.email;
        let f_pwd = req.body.pwd;
        let f_avatar = req.body.avatar;
        
        if(f_name!=""&&f_email!=""&&f_pwd!=""){
            //判断是否存在
            var whereStr = {$or:[{"name":f_name},{"email": f_email}]};
            AdminUserModel.find(whereStr).then((docs)=>{
                
                if(docs.length){
                    res.json({code:"0",msg:"昵称或邮箱重复"});
                }else{
                    try {
                        let obj={
                            name: f_name, //用户名
                            pwd: f_pwd, //密码
                            avatar:f_avatar,//头像
                            email:f_email, //邮箱
                            //creator:req.session.loginUser.name//创建者
                        }
                        console.log(obj)
                        const gradeobj = new AdminUserModel(obj);
                        gradeobj.save().then((pro)=>{
                            res.json({code:"1",data:{},msg:"success"});
                        })
                    }catch(err){
                        res.send({
                            code: '0',
                            msg: '添加用户失败' + err.message,
                        })
                    }
                }
            })
        }else{
            res.json({code:"0",msg:"字段不能为空！"});
        }
    }   

    
    
    /**
    * - 修改用户密码
    * oldPassword ：旧密码
    * newPassword - 新密码
    * confirmPassword - 确认密码
    */
    async postEditUserPassword(req, res, next) {
        let oldPwd = tools.md5(setting.salt_md5_key+req.body.oldPassword);
        let newPwd = req.body.newPassword;
        let confirmPwd = req.body.confirmPassword;
        let upwd = req.session.loginUser.pwd;
        console.log(upwd)
        console.log(oldPwd)
        if(newPwd == confirmPwd){
            if(upwd==oldPwd){
                let npwd = tools.md5(setting.salt_md5_key+newPwd);
                let obj={
                    pwd:npwd,//头像
                }
                try{
                    await AdminUserModel.findOneAndUpdate({ _id: req.session.loginUser.id }, { $set: obj})
                    req.session.loginUser.pwd = npwd;
                    req.session.save();
                    res.json({code:"1",data:{},msg:"success"});
                }catch(e){
                    res.json({code:"0",data:{},msg:"更新失败"});
                }
            }else{
                res.json({code:"0",msg:"旧密码错误"});
            }
        }else{
            res.json({code:"0",msg:"两次密码不一致"});
        }
    }
}

module.exports = new AdminUserControl();