<template>
	<view class="login-tel">
		<Lines></Lines>
		<view class="wrapper">
			<view class="user-tel">
				<view class="tel">手机号</view>
				<input type="number" maxlength="11" value="" v-model="userTel" placeholder="请输入11位手机号" />
			</view>
			<view class="next-btn" @tap="goNext">
				下一步
			</view>
			<view class="tel-foot">
				<view>继续注册表示您阅读并同意</view>
				<view class="f-active-color">《用户注册协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from '@/components/common/line.vue'
	import $http from "@/common/api/request.js"
	export default {
		data() {
			return {
				userTel: "",
				rules: {
					userTel: {
						rule: /^1[3456789]\d{9}$/,
						msg: "请输入正确的手机号"
					}
				}
			}
		},
		methods: {
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
			goNext() {
				if (!this.vailData('userTel')) {
					return;
				}

				$http.request({
					url: "/regist",
					data: {
						phone: this.userTel
					},
					method: "POST"
				}).then((res) => {
					if (!res.success) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						return;
					} else {
						uni.navigateTo({
							url: `../login-code/login-code?phone=${this.userTel}`
						})
					}
				})
			}
		},
		components: {
			Lines
		}
	}
</script>

<style scoped>
	.wrapper {
		padding: 20rpx;
	}

	.user-tel {
		padding: 20rpx;
		border-bottom: 2rpx solid #E1E1E1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user-tel input {
		flex: 1;
		text-align: left;
	}

	.tel {
		padding: 0 20rpx;
	}

	.next-btn {
		margin-top: 40rpx;
		padding: 0 20rpx;
		background-color: #49BDFB;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
		height: 90rpx;
		font-size: 36rpx;
		border-radius: 50rpx;
		word-spacing: 10rpx;
	}

	/* 提示 */
	.tel-foot {
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
	}
</style>
