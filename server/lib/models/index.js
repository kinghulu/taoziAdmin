
var mongoose = require('mongoose');
//是否是开发环境
const isProd = process.env.NODE_ENV === 'production';
const { setting } = require('../../utils');

if (!isProd) {
    mongoose.connect(setting.URL, { useFindAndModify: false,useNewUrlParser: true });
} else {
    mongoose.connect('mongodb://' + setting.USERNAME + ':' + setting.PASSWORD + '@' + setting.HOST + ':' + setting.PORT + '/' + setting.DB + '', { useFindAndModify: false,useNewUrlParser: true });
}


mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once('open', () => {
    console.log('连接数据成功')
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
    // mongoose.connect(config.url, {server:{auto_reconnect:true}});
});


exports.AdminUserModel = require('./AdminUser');
exports.AdminRoleModel = require('./AdminRole');
