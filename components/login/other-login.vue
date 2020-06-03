<template>
	<view class="login-other">
		<view class="other-text">
			<view class="text">使用以下方式登录</view>
		</view>
		<view class="other-main">
			<view class="other-item" @tap="loginOther('weixin')">
				<image class="other-img" src="../../static/img/wx.png" mode=""></image>
				<view>微信登录</view>
			</view>
			<view class="other-item" @tap="loginOther('sinaweibo')">
				<image class="other-img" src="../../static/img/wb.png" mode=""></image>
				<view>微博登录</view>
			</view>
			<view class="other-item" @tap="loginOther('qq')">
				<image class="other-img" src="../../static/img/qq.png" mode=""></image>
				<view>QQ登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import {
		mapMutations
	} from "vuex"
	export default {
		methods: {
			...mapMutations(['login']),
			loginOther(mode) {
				uni.login({
					provider: mode,
					// openid是唯一的，需要存到数据库中，确认唯一身份用
					success: (res) => {
						// 获取用户信息
						uni.getUserInfo({
							provider: mode,
							success: (res) => {
								// 
								let provider = mode;
								let openid = res.userInfo.openid || res.userInfo.openId;
								let nickName = res.userInfo.nickName;
								let avatarUrl = res.userInfo.avatarUrl

								$http.request({
									url: "/loginother",
									method: "POST",
									data: {
										provider,
										openid,
										nickName,
										avatarUrl
									}
								}).then((res) => {
									if (res.success) {
										this.login(res.data)
										uni.redirectTo({
											url: '../../pages/index/index'
										})
									}
								})
							}
						})
					}
				}) //end uni.login
			}
		}
	}
</script>

<style scoped>
	/* 其他方式登录 */
	.login-other {
		padding: 100rpx 0;
	}

	.other-text {
		display: flex;
		justify-content: center;
	}

	.other-text::after {
		content: '';
		height: 2rpx;
		flex: 1;
		background-color: #CCCCCC;
	}

	.other-text::before {
		content: '';
		height: 2rpx;
		flex: 1;
		background-color: #CCCCCC;
	}

	.text {
		line-height: 0;
		padding: 0 10rpx;
	}

	.other-main {
		margin-top: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.other-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.other-img {
		width: 80rpx;
		height: 80rpx;
		padding-bottom: 20rpx;
	}
</style>
