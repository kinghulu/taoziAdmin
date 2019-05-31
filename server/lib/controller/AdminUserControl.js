
const {AdminUserModel,AdminRoleModel} = require("../models");
const {
    setting,tools,creatRes
} = require('../../utils');
var moment = require('moment');
var jwt = require('jsonwebtoken');

class AdminUserControl {
    constructor() {
        //super() 
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
            const user =await AdminUserModel.findOne(userObj).populate({ path: 'roleid', select: 'rules' });
            if (user) {
                //判断是否禁用
                if(user.state==1){
                    await AdminUserModel.findOneAndUpdate(userObj, { $set: {"last_login_time":moment().format("YYYY-MM-DD HH:mm:ss")}})
                    let nickname = user.nickname?user.nickname:user.name;
                    //有效期24小时
                    let _token = jwt.sign({user:{name:nickname,id:user.id},exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, setting.encrypt_key);
                    req.session.uid = tools.md5(setting.SECERT+user.id);
                    let _rules = "";
                    if(user.roleid){
                        _rules = user.roleid.rules
                    }
                    res.json(creatRes("success",{
                        token:_token,
                        name:nickname,
                        avatar:user.avatar,
                        rules:_rules,
                        role:user.role
                    }))
                }else{
                    res.json(creatRes('fail','',"账号 " + user.nickname + " 已被禁用，请联系管理员"));
                }
            }else{
                res.json(creatRes('userLoginError'));
            }
        }catch(e){
            console.log(e);
            res.json(creatRes('fail'));
        };
    }



    /**
    * - 获取用户信息
    * @token
    */
    async getUserInfo(req, res, next){
        let id = req.user.id;
        console.log(req.session.uid)
        //res.json(creatRes("success",{id:req.user.id,c:req.session.uid}));
        const userObj = {
            _id: id,
        }
        try{
            const user =await AdminUserModel.findOne(userObj);
            if (user) {
                res.json(creatRes("success",{name:user.nickname,avatar:user.avatar}))
            }else{
                res.json(creatRes("fail",'','获取用户信息失败'));
            }
        }catch(e){
            res.json(creatRes("fail",'','获取用户信息失败'));
        };
    }    

    async logOut(req, res, next) {
        try{
            res.json(creatRes("success"));
            req.session.destroy();
        }catch(e){
            res.json(creatRes('fail'));
        };
    }
    /**
    * - 添加用户
    * @ name - 登录名
    * @ nickname - 昵称
    * @ pwd - 加密后的密码
    * @ avatar - 头像地址
    * @ role - 权限名
    */
   async addUserFn(req, res, next) {
        let f_name = req.body.name;
        let f_nickname = req.body.nickname;
        let f_pwd = req.body.pwd;
        let f_avatar = req.body.avatar;
        let f_role = req.body.role_id;
        
        if(f_name&&f_pwd){
            //判断是否存在
            var whereStr = {$or:[{"name":f_name},{"nickname": f_nickname}]};
            var whereStr = {"name":f_name};
            AdminUserModel.find(whereStr).then((docs)=>{
                if(docs.length){
                    res.json(creatRes("hasExistError"));
                }else{
                    try {
                        let _creator = "管理员";
                        if(req.user&&req.user.name){
                            _creator = req.user.name
                        }
                        let obj={
                            name: f_name, //用户名
                            pwd: f_pwd, //密码
                            avatar:f_avatar,//头像
                            nickname:f_nickname,
                            roleid:f_role,
                            creator:_creator,//创建者
                            creat_time:moment().format("YYYY-MM-DD HH:mm:ss")
                        }
                        const userobj = new AdminUserModel(obj);
                        userobj.save().then((pro)=>{
                            res.json(creatRes("success"));
                        })
                    }catch(err){
                        res.json(creatRes("addRecordError"));
                    }
                }
            })
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }   
    
    /**
    * - 添加权限
    * name - 权限名
    * rules - 权限字符串
    * confirmPassword - 确认密码
    */
    async addRoles(req,res,next){
        let f_name = req.body.name;
        let f_rules = req.body.rules;
        if(f_name&&f_rules){
            //判断是否存在
            var whereStr = {"name":f_name};
            AdminRoleModel.find(whereStr).then((docs)=>{
                if(docs.length){
                    res.json(creatRes("hasExistError"));
                }else{
                    try {
                        let _creator = "管理员";
                        if(req.user&&req.user.name){
                            _creator = req.user.name
                        }
                        let obj={
                            name: f_name, 
                            rules:f_rules,
                            creator:_creator,//创建者
                            creat_time:moment().format("YYYY-MM-DD HH:mm:ss")
                        }
                        const roleobj = new AdminRoleModel(obj);
                        roleobj.save().then((pro)=>{
                            res.json(creatRes("success"));
                        })
                    }catch(err){
                        res.json(creatRes("addRecordError"));
                    }
                }
            })
            
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }
    /**
    * - 获取权限列表
    */
    async getRoleList(req,res,next){
        AdminRoleModel.find({state:{$ne:-1}}).then((docs)=>{
            res.json(creatRes("success",docs));
        })
    }
    /**
    * - 获取用户列表
    */
    async getUserList(req,res,next){
        AdminUserModel.find({state:{$ne:-1}}).populate({ path: 'roleid', select: 'name' }).then((docs)=>{
            let list = [];
            for(let i in docs){
                let one = docs[i];
                let rolename = "";
                if(one.role=="admin"){
                    rolename = one.nickname
                }else{
                    if(one.roleid){
                        rolename = one.roleid.name
                    }
                }
                let obj = {
                    name:one.name,
                    id:one.id,
                    last_login_time:one.last_login_time,
                    nickname:one.nickname,
                    rolename:rolename,
                    role:one.role,
                    state:one.state,
                    creat_time: one.creat_time,
                    creator:one.creator
                }
                list.push(obj);
            }
            res.json(creatRes("success",list));   
        })
    }

     /**
    * - 切换权限状态
    */
    async changeRoleState(req,res,next){
        let f_id = req.body.id;
        let f_state = req.body.state;
        if(f_id){
            try{
                await AdminRoleModel.findOneAndUpdate({ _id: f_id }, { $set: {"state":f_state} })
                res.json(creatRes("success"));
            }catch(e){
                res.json(creatRes("fail"));
            }
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }
    /**
    * - 切换用户状态
    */
    async changeUserState(req,res,next){
        let f_id = req.body.id;
        let f_state = req.body.state;
        if(f_id){
            try{
                await AdminUserModel.findOneAndUpdate({ _id: f_id }, { $set: {"state":f_state} })
                res.json(creatRes("success"));
            }catch(e){
                res.json(creatRes("fail"));
            }
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }  
    /**
    * - 获取用户详细
    */
    async getUserDetail(req,res,next){
        let f_id = req.body.id;
        if(f_id==""||f_id==undefined){
            res.json(creatRes("paramsMissing"));
        }
        AdminUserModel.findOne({_id:f_id}).exec(function (err, docs) {
            if (err){
                res.json(creatRes("fail"));
            }else{  
                let user = {
                    id:docs.id,
                    name:docs.name,
                    nickname:docs.nickname,
                    roleid:docs.roleid,
                }
                res.json(creatRes("success",user));
            }
        });
    }
    /**
    * - 获取权限详细
    */
    async getRoleDetail(req,res,next){
        let f_id = req.body.id;
        if(f_id==""||f_id==undefined){
            res.json(creatRes("paramsMissing"));
        }
        let wherestr = {_id:f_id}
        try{
            AdminRoleModel.find(wherestr).then((docs)=>{
                if(docs.length){
                    res.json(creatRes("success",docs[0]));
                }
                res.json(creatRes("fail"));
            })
        }catch(e){
            res.json(creatRes("fail"));
        }
    }
    /**
    * - 更新权限
    */
    async updateRoleById(req,res,next){
        let f_id = req.body.id;
        let f_name = req.body.name;
        let f_rules = req.body.rules;
        if(f_id&&f_name&&f_rules){
            try{
                await AdminRoleModel.findOneAndUpdate({ _id: f_id }, { $set: {"name":f_name,"rules":f_rules} });
                res.json(creatRes("success"));
            }catch(e){
                res.json(creatRes("fail"));
            }
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }
    
    /**
    * - 更新用户
    */
    async updateUserById(req,res,next){
        let f_id = req.body.id;
        let f_name = req.body.name;
        let f_nickname = req.body.nickname;
        let f_pwd = req.body.pwd;
        let f_roleid = req.body.roleid;
        
        if(f_id&&f_name&&f_nickname&&f_roleid){
            try{
                let setobj = {"name":f_name,"nickname":f_nickname,"roleid":f_roleid};
                if(f_pwd){
                    setobj = {"name":f_name,"nickname":f_nickname,"roleid":f_roleid,"pwd":f_pwd}
                }
                await AdminUserModel.findOneAndUpdate({ _id: f_id }, { $set: setobj });
                res.json(creatRes("success"));
            }catch(e){
                res.json(creatRes("fail"));
            }
        }else{
            res.json(creatRes("paramsMissing"));
        }
    }

    /**
    * - 修改用户密码
    * oldPassword ：旧密码
    * newPassword - 新密码
    * confirmPassword - 确认密码
    */
    async postEditUserPassword(req, res, next) {
        let oldPwd = req.body.oldPassword;
        let newPwd = req.body.newPassword;
        let confirmPwd = req.body.confirmPassword;
        if(newPwd == confirmPwd){
            let uobj = {_id:req.user.id}
            const user =await AdminUserModel.findOne(uobj);
            if(user.pwd==oldPwd){
                let obj={
                    pwd:newPwd,
                }
                try{
                    await AdminUserModel.findOneAndUpdate(uobj, { $set: obj})
                    res.json(creatRes('success'));
                }catch(e){
                    res.json(creatRes('fail','','更新失败！'));
                }
            }else{
                res.json(creatRes('fail','','旧密码错误！'));
            }
        }else{
            res.json(creatRes('fail','','两次密码不一致！'));
        }
    }
}

module.exports = new AdminUserControl();