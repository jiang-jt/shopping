export default{
	state:{
		userInfo:{},
		loginStatus:false,
		token:null
	},
	getters:{
		
	},
	mutations:{
		// 退出登录
		loginOut(state){
			state.userInfo = {};
			state.loginStatus = false;
			state.token = null;
			// 清除本地存储
			uni.removeStorageSync('userInfo');
		},
		// 每次运行应用程序，从本地存储中读取用户信息
		initUser(state){
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				userInfo = JSON.parse(userInfo);
				state.userInfo = userInfo;
				state.loginStatus = true;
				state.token = userInfo.token;
			}
		},
		// 登录之后，存储用户信息
		login(state,userInfo){
			state.userInfo = userInfo;
			state.loginStatus = true;
			state.token = userInfo.token;
			uni.setStorageSync('userInfo',JSON.stringify(userInfo));
		}
	},
	actions:{
		
	}
}