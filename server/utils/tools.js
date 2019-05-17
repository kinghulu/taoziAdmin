
let setting = require('./setting');
var CryptoJS = require("crypto-js");

module.exports =  {
    /**
     * 对称加密解密
    */
    AES:{
        /**
        * - 加密
        * @params message - 加密内容
        */
		encrypt: (message)=>{
			return CryptoJS.AES.encrypt(message,setting.encrypt_key,{
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}).toString();
		},
        /**
        * - 解密
        * @params encrypt - 密文
        */
		decrypt: (encrypt)=>{
			return CryptoJS.AES.decrypt(encrypt, setting.encrypt_key,{
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}).toString(CryptoJS.enc.Utf8);
		}
    },
    //Base64
	Base64: {
		stringify: (message)=>{
			let base64Str = new Buffer(message).toString('base64');
			return  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(base64Str));
		}
    },
    //SHA
	SHA: {
		SHA1: (message)=>{
			return CryptoJS.SHA1(message).toString();
        },
        SHA256: (message)=>{
			return CryptoJS.SHA256(message).toString();
		}
	},
    // MD5加密
    md5: (str)=>{
        return  CryptoJS.MD5(str).toString();
	},
	
	getRandomStr:(len)=>{
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
	　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
	}
}