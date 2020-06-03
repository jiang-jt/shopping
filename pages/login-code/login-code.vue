<template>
	<view>
		<Lines></Lines>
		<view class="wrapper">
			<view class="user-tel">
				<view class="tel">验证码</view>
				<input type="text" maxlength="11" value="" v-model="userCode" placeholder="请输入验证码" />
				<button size="mini" :disabled="isDisabled" plain="true" @tap="sendCode">{{codeMsg}}</button>
			</view>
			<view class="tel-foot">
				我们已经给你的手机号{{phoneNum}}发送了验证短信  (统一验证码:1234) 
			</view>
			<view class="next-btn" @tap="goNextIndex">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from '@/components/common/line.vue'
	import $http from "@/common/api/request.js"
	import {mapMutations} from "vuex"
	export default {
		data() {
			return {
				// 验证码
				userCode: "",
				// 倒计时时间
				codeNum: 60,
				// 显示的文本
				codeMsg: "",
				// 按钮是否禁用 ,默认不禁用
				isDisabled: false,
				// 手机号
				phoneNum: '',
				// 后端返回的验证码
				getCode:''

			}
		},
		onLoad(e) {
			this.phoneNum = e.phone;
		},
		onReady() {
			this.codeMsg = '重新发送(' + this.codeNum + ')';
			this.sendCode();
		},
		methods: {
			// 用户登录
			...mapMutations(['login']),
			// 发送验证码
			sendCode() {
				// 请求接口，返回验证码
				$http.request({
					url: "/code",
					method: "POST",
					data: {
						phone: this.phoneNum
					}
				}).then((res) => {
					this.getCode = res.code;
				})
				
				// 禁用按钮
				this.isDisabled = true;
				let timer = setInterval(() => {
					--this.codeNum;
					this.codeMsg = '重新发送(' + this.codeNum + ')';
				}, 1000)
				setTimeout(() => {
					clearInterval(timer);
					this.codeNum = 60;
					this.codeMsg = '重新发送';
					this.isDisabled = false;
				}, 60000)
			},
			// 下一步
			goNextIndex() {
				if(this.getCode == this.userCode){
					// 发送请求，往数据库添加一个用户
					$http.request({
						url: "/addUser",
						method: "POST",
						data: {
							userName: this.phoneNum,
							code:this.userCode
						}
					}).then((res) => {
						// 跳转首页前，自动登录
						this.login(res.data[0]);
						if(res.success){
							uni.redirectTo({
								url:'../index/index'
							})
						}
					}).catch(()=>{
						uni.showToast({
							title:'请求失败',
							icon:"none"
						})
					})
					
					
				}else{
					uni.showToast({
						title:"验证码错误，请重试",
						icon:"none"
					})
				}
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
		margin-top: 10rpx;
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
		text-align: left;
		font-size: 24rpx;
	}
</style>
