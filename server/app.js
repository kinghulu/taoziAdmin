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
 * --------------- Main
 * ---------------- by yaohuitao@100tal.com
 * ----------------- 20190514
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const isProduction = process.env.NODE_ENV === 'production';

const tools = require('./routes/tool');
console.log(tools.a())

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


// const MongoStore = require('connect-mongo')(session);
// app.use(session({
//   name: "lightAdmin",
//   secret: 'nodeadmin',  // 用来对session id相关的cookie进行签名
//   saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
//   resave: false,  // 是否每次都重新保存会话，建议false
//   cookie: {
//       maxAge: 12 * 3600 * 1000  // 有效期，单位是毫秒
//   },
//   store: new MongoStore({
//       db: "session",
//       host: "localhost",
//       port: 27020,
//       url: !isProd ? setting.URL : 'mongodb://' + setting.USERNAME + ':' + setting.PASSWORD + '@' + setting.HOST + ':' + setting.PORT + '/' + setting.DB + ''
//   })
// }));

/**
 * 路由
*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', (req, res) => res.send("helloword"));
app.post('/index/time', (req, res) => res.json({time:new Date().getTime()}))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  res.send({title:"404"});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({title:"500"});
});

module.exports = app;
