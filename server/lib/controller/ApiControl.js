const {
    setting,tools,creatRes
} = require('../../utils');
var moment = require('moment');

class ApiControl {
    constructor() {
        //super()
    }

    /**
    * - 获取服务器时间
    * @uname - 用户名
    * @upass - 密码
    */
    async getTime(req, res, next){
        let date = moment();
        res.json(creatRes('success',{
            timestamp:date.unix(),
            timeunix:date.valueOf(),
            ymd:date.format('YYYY-MM-DD'),
            ymdhms:date.format('YYYY-MM-DD HH:mm:ss')
        }));
    }
}

module.exports = new ApiControl();