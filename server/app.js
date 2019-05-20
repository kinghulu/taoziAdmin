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
 * --------------- app
 * ---------------- by taozi 578999047@qq.com
 * ----------------- 20190515
 * ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀🌙｀ヽヽ｀ヽ、ヽ｀ヽ｀、ヽ｀｀、ヽ 
 * 、｀｀、 ｀、ヽ｀ 、、ヽ｀｀、ヽ、｀｀、、ヽ｀｀、 、ヽヽ｀、｀、、ヽヽ、｀｀
 * 、 、 ヽ｀、ヽ｀｀、ヽ｀ヽ｀、、ヽ ｀ヽ 、ヽ｀｀ヽ、💃｀ヽ🏃、、🚶｀🚶🚶ヽ｀、
***************************************************************************************/
var express = require('express');
const isProd = process.env.NODE_ENV === 'production';
var path = require('path');

var app = express();


const { setting } = require('./utils');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.all('/api/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.all('/admin/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://debug.dir");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With,authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
app.use(session({
  name: "taoziadmin",
  secret: setting.encrypt_key,  // 用来对session id相关的cookie进行签名
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
      maxAge: 12 * 3600 * 1000  // 有效期，单位是毫秒
  },
  store: new MongoStore({
      db: "session",
      host: "localhost",
      port: 27020,
      url: !isProd ? setting.URL : 'mongodb://' + setting.USERNAME + ':' + setting.PASSWORD + '@' + setting.HOST + ':' + setting.PORT + '/' + setting.DB + ''
  })
}));


/**
 * 路由
*/
const {api,admin} = require('./routes');
app.use('/api', api);
app.use('/admin', admin);

app.get('/', (req, res) => res.send("Hello World"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  if(req.method == "GET"){
    res.send("Hello World,I'm missing");
  }else{
    res.json({
      code:'40001',
      data:"",
      msg:"接口不见了！"
    });
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  if(req.method == "GET"){
    res.send("Hello World,I'm 500");
  }else{
    res.json({
      code:'40002',
      data:"",
      msg:"发现八阿哥！"
    });
  }
});

module.exports = app;
