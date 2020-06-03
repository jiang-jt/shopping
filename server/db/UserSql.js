var User = {
	// 查询用户名
	queryUserName(param) {
		if(param.userName){
			// 为方便操作，param.userName也是手机号
			return `select * from user where userName='${param.userName}' or phone='${param.userName}'`;
		}else{
			// 第三方
			return `select * from user where provider='${param.provider}' and openid='${param.openid}'`;
		}
		
	},
	// 验证用户名和密码
	queryUserPwd(param) {
		// 为方便操作，param.userName也是手机号
		return `select * from user where (userName='${param.userName}' or phone='${param.userName}') and userPwd='${param.userPwd}'`;
	},
	// 增加一条用户数据
	insertData(param) {
		// 生成token
		let jwt = require('jsonwebtoken');
		let payload = {
			user: param.userName || param.openid
		};
		let secret = "jiang";    //
		let token = jwt.sign(payload, secret);   //token
		
		
		let phone = param.userName || '';
		let imgUrl = param.avatarUrl || '../../static/img/avatar.jpg';
		let nickName = param.userName || param.nickName;
		let openid = param.openid || '';
		let provider = param.provider || '';
		
		return `insert into user (userName,userPwd,phone,imgUrl,nickName,token,openid,provider) values
		 ('','${123456}','${phone}','${imgUrl}','${nickName}','${token}','${openid}','${provider}')`;
	}
}
exports = module.exports = User;
