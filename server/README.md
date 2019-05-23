# 后端(API)
只提供接口服务

### 介绍
基于Node.js、Express、MongoDB、jsonwebtoken的后端管理系统。

### 安装教程
1. npm install
2. 需要先启动mongo数据库
    mongod -f conf/mongod.conf
其中 conf/mongod.conf 为启动mongo配置文件的路径。

数据库配置位置：/server/utils/setting.js

3. npm run serve


### 使用说明

1. 密码规则
   数据库存加密好的字符串，加密规则：md5(SECERT + password)

### 部署二级域名
    api.xxx.com