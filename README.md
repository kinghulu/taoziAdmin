# TaoziAdmin

## 介绍
基于Node.js、Express、MongoDB、Vue的后端管理系统。

预览图
![登录](http://yaohuitao.com/a/img/git/git_taoziAdmin_md1.jpg)
![主界面](http://yaohuitao.com/a/img/git/git_taoziAdmin_md2.jpg)

## 软件架构
为了结构清晰，前后端项目分开运行
    <br>---client:前端项目
    <br>---server:后端项目


## 安装教程
git clone https://gitee.com/yaohuitao/taoziAdmin.git

1、启动mongodb，

****

2、启动后端api

    cd server
    npm install
    npm run serve

****
3、启动前端

    cd client
    npm install
    npm run serve

4、后台测试账号：admin/abc123


****
## 接口调用说明
### 接口sign字段校验
为了增加接口安全，加入sign字段，生成规则如下：
所有参数和值组成 key=value的形式进行排序,然后用“&”拼接成字符串，
    如：name=admin&pwd=15c556151b6b908d9a835efcee721e9a15a303177bc3fbd375fc2769c6d9bdc7
然后加盐，进行md5加密。

****
## 功能介绍
### JWT验证用户身份
登录成功，生成JWT，返给前端，前端接到后放入请求头中
    this.$ajax.defaults.headers.common['Authorization'] = res.token;
每次请求，后端需要校验该接口是否需要鉴权，需要则验证JWT，取出uid 进行操作。
该版本还加入了session进行登录用户的存储，这样可以控制JWT的失效时间。

### 滑动验证
后续迭代


### 权限设计
* 权限规则存放在前端项目中，尽量减少与后端的耦合。
* 权限配置文件：client/src/utils/config.js  roleArr;
* 权限控制路由的显示以及菜单的显示，所以在对应的路由表client/src/router.js配置的meta.role写上对应的路由。
* 细化到按钮级别的控制，
    如用户管理的修改权限对应"aa2"，需要在用到的地方（用户管理列表页）mounted 时调用 this.hasEditRole =this.isHasAuth("aa2");那么我们就可以在控制视图的地方，根据hasEditRole的值来控制了。



