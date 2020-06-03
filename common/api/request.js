import store from '../../store/index.js'
export default {
	common: {
		baseUrl: "http://192.168.0.7:3000/api",
		data: {},
		header: {
			"Content-Type": "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "GET",
		dataType: "json"
	},
	request(options) {
		
		uni.showLoading({
			title: "加载中"
		})
		options.url = this.common.baseUrl + options.url;
		options.data = options.data || this.common.data;
		options.header = options.header || this.common.header;
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;
		
		// 验证token,是否需要验证用户是否登录
		if(options.header.token){
			options.header.token = store.state.user.token;
			if(!options.header.token){
				uni.showToast({
					title:"请先登录",
					icon:"none"
				})
				return uni.redirectTo({
					url:'/pages/login/login.vue'
				})
			}
		}
		
		return new Promise((resolve, reject) => {
			uni.request({
				...options,
				success: (res) => {
					setTimeout(function() {
						uni.hideLoading();
					}, 500)
					if (res.statusCode != 200) {
						return reject();
					}
					let data = res.data.data;
					resolve(data);
				},
				fail:(err)=>{
					setTimeout(function() {
						uni.hideLoading();
					}, 500)
					uni.showToast({
						title:"加载失败",
						icon:"none"
					})
				}
			})
		})
	}
}
