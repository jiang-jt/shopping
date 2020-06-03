import Vue from 'vue'
import App from './App'
import store from './store/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store

Vue.prototype.redirectTo = (options) => {
	if (!store.state.user.loginStatus) {
		uni.showToast({
			title: "请先登录",
			icon: "none"
		})
		return uni.redirectTo({
				url: '/pages/login/login'
			})
	}
	uni.redirectTo(options);
}



const app = new Vue({
	...App,
	store
})
app.$mount()
