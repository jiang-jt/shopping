<template>
	<view class="payment-success">
		<view class="pay-text">支付成功!</view>
		<view class="back-btn" @tap="goIndex">返回首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goIndex(){
				uni.redirectTo({
					url:'../index/index'
				})
			}
		}
	}
</script>

<style scoped>
.payment-success{
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.back-btn{
	padding: 10rpx 80rpx;
	border: 2rpx solid #49BDFB;
	color: #49BDFB;
	border-radius: 40rpx;
	margin-top: 10rpx;
}
.pay-text{
	font-size: 36rpx;
}
</style>
