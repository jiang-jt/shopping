<template>
	<view class="login">
		<view class="status_bar"></view>
		<swiper vertical="true" :style="'height:'+clientHeight+'px;'">
			<swiper-item>
				<view class="login-tel">
					<image @tap="goList" class="login-close" src="../../static/img/close.png" mode=""></image>
					<view class="login-logo f-active-color">
						百年奥莱
					</view>
					<view class="login-tel-btn" @tap="goLoginTel">
						手机号注册
					</view>
				</view>
				<view class="other-wrapper">
					<!-- 其他方式登录 -->
					<otherLogin></otherLogin>
					<!-- 已有账号去登录 -->
					<view class="login-go">
						<view>已有账号，去登录</view>
						<image src="../../static/img/down.png" mode=""></image>
					</view>
					<!-- 已有账号去登录 end -->
				</view>
			</swiper-item>
			<swiper-item>
				<!-- 第二屏 -->
				<view class="login-tel">
					<!-- 关闭/去注册 -->
					<view class="login-main">
						<image @tap="goList" class="login-close" src="../../static/img/close.png" mode=""></image>
						<view class="login-go">
							<image src="../../static/img/up.png" mode=""></image>
							<view>没有账号，去注册</view>
						</view>
					</view>
					<!-- 账号密码登录 -->
					<view class="login-info">
						<view class="user-item">
							<view class="f-b">账号</view>
							<input type="text" v-model="userName" value="" placeholder="请输入手机号/昵称" />
						</view>
						<view class="user-item">
							<view class="f-b">密码</view>
							<input type="text" v-model="userPwd" password="true" value="" placeholder="6-16位字符" />
						</view>
						<view class="user-item user-forget">
							<view class="f-b">忘记密码？</view>
							<view class="f-b">免密登录</view>
						</view>
						<view class="login-tel-btn" @tap="submit">
							登 录
						</view>
						<view class="user-tip">温馨提示，您可选择免密登录，方便快捷。</view>
					</view>
					<!-- 其他登录方式 -->
					<otherLogin></otherLogin>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import otherLogin from '@/components/login/other-login.vue'
	import {mapMutations} from "vuex"
	export default {
		data() {
			return {
				clientHeight: 0,
				// 用户输入的内容
				userName: "",
				userPwd: "",
				rules: {
					userName: {
						rule: /\S/,
						msg: "账号不能为空"
					},
					userPwd: {
						rule: /^[0-9a-zA-Z]{6,16}$/,
						msg: "密码为6-16位字符"
					},
				}
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - res.statusBarHeight;
				}
			});
		},
		methods: {
			...mapMutations(['login']),
			goList() {
				uni.redirectTo({
					url: '../list/list'
				})
			},
			// 计算高度[兼容处理]
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return 44 + res.statusBarHeight;
				} else if (system === 'android') {
					return 48 + res.statusBarHeight;
				} else {
					return 0;
				}
			},
			// 点击登录
			submit() {
				// 验证是否符合规则
				if (!this.vailData('userName')) {
					return;
				}
				if (!this.vailData('userPwd')) {
					return;
				}

				uni.showLoading({
					title: "登录中..."
				})
				$http.request({
					url: "/login",
					method: "POST",
					data: {
						userName: this.userName,
						userPwd: this.userPwd
					}
				}).then((res) => {
					if(res.success){
						this.login(res.data)
						uni.showToast({
							title:"登录成功",
							icon:"none"
						})
						
						setTimeout(()=>{
							uni.hideLoading();
							uni.redirectTo({
								url:'../my/my'
							})
						},2000)
					}else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
				
			},
			// 正则表达式验证表单
			vailData(key) {
				let bool = true;
				if (!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title: this.rules[key].msg,
						icon: "none"
					})
					bool = false;
					return false;
				}
				return bool;
			},
			// 手机号登录
			goLoginTel() {
				uni.navigateTo({
					url: '../login-tel/login-tel'
				})
			}
		},
		components: {
			otherLogin
		}
	}
</script>

<style scoped>
	.login {
		background-color: #FFFFFF;
		padding: 30rpx;

	}

	/* 手机号登录 */
	.login-tel {}

	.login-close {
		width: 50rpx;
		height: 50rpx;
	}

	.login-logo {
		font-size: 100rpx;
		text-align: center;
		line-height: 460rpx;
	}

	.login-tel-btn {
		background-color: #49BDFB;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
		height: 90rpx;
		font-size: 36rpx;
		border-radius: 50rpx;
		width: 100%;
		word-spacing: 10rpx;
	}

	/* 已有账号去登录 */
	.login-info {
		margin-top: 200rpx;
	}

	.login-go {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.login-go image {
		width: 60rpx;
		height: 60rpx;
	}

	.other-wrapper {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	/* 第二屏 */
	.login-main {
		display: flex;

	}

	.login-main>view {
		flex: 1;
	}

	/* 账号密码登录 */

	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #CCCCCC;

	}

	.f-b {
		padding: 0 16rpx;
		font-weight: 400;
	}

	.user-item input {
		flex: 1;
		text-align: left;
	}

	.user-forget {
		border-bottom: none;
	}

	.user-tip {
		font-size: 24rpx;
		text-align: center;
		color: #C8C7CC;
	}
</style>
