<template>
	<view class="payment">
		<!-- 自定义导航栏 -->
		<uniNavBar title="确认支付" left-text="关闭" fixed="true" status-bar="true" @clickLeft="goBack"></uniNavBar>

		<!-- 支付方式 -->
		<view class="pay-list">
			<label for="">
				<view class="pay-item">
					<image class="pay-img" src="../../static/img/zfb.png" mode=""></image>
					<view class="pay-title">
						<view class="title-head">支付宝支付</view>
						<view class="title-content f-color">推荐支付宝用户使用</view>
					</view>
					<radio-group name="a" style="width: 100rpx;" @change="changePayway($event)">
						<label class="radio">
							<radio value="zfb" :checked="isZhi" /><text></text>
						</label>
					</radio-group>
				</view>
			</label>
			<label for="">
				<view class="pay-item">
					<image class="pay-img" src="../../static/img/wxf.png" mode=""></image>
					<view class="pay-title">
						<view class="title-head">微信支付</view>
						<view class="title-content f-color">推荐有微信账号的用户使用</view>
					</view>
					<radio-group name="a" style="width: 100rpx;" @change="changePayway($event)">
						<label class="radio">
							<radio value="wx" :checked="isWx" /><text></text>
						</label>
					</radio-group>
				</view>
			</label>
		</view>

		<!-- 底部 -->
		<view class="pay-foot">
			<view class="foot-l">
				<view class="foot-total f-color">合计</view>
				<view class="foot-price">￥{{totalCount.pprice}}</view>
			</view>
			<view class="foot-r" @tap="goPayment">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import $http from "@/common/api/request.js"
	import uniNavBar from "@/components/uni/uni-nav-bar/uni-nav-bar.vue"
	export default {
		data() {
			return {
				isZhi: false,
				isWx: true
			}
		},
		onLoad(e) {
			this.listId = e.commodityId;
		},
		computed: {
			...mapGetters(["totalCount"])
		},
		components: {
			uniNavBar
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转支付成功
			goPayment() {
				// 请求接口，付款之后，将该订单删除
				$http.request({
					url: "/payment",
					method:"POST",
					header:{
						token:true
					},
					data:{
						listId : this.listId
					}
				}).then((res) => {
					console.log(res);
				})
				uni.navigateTo({
					url: '../payment-success/payment-success'
				})
			},
			// 切换支付方式
			changePayway($event) {
				let payway = $event.detail.value;
				if (payway == 'zfb') {
					this.isWx = false;
					this.isZhi = !this.isZhi;
				} else {
					this.isZhi = false
					this.isWx = !this.isWx;
				}

			}
		}
	}
</script>

<style scoped>
	.pay-list {
		padding: 20rpx;
	}

	.pay-item {
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #E1E1E1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pay-img {
		width: 80rpx;
		height: 80rpx;
		padding-right: 20rpx;
	}

	.pay-title {
		flex: 1;
	}

	.title-head {}

	.title-content {
		font-size: 24rpx;
	}

	/* 去支付 */
	.pay-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #000000;
	}

	.foot-l {
		flex: 1;
		display: flex;
	}

	.foot-total {
		padding-left: 20rpx;
	}

	.foot-price {
		padding-left: 20rpx;
		color: #FFFFFF;
	}

	.foot-r {
		padding: 0 60rpx;
		background-color: #49BDFB;
		line-height: 90rpx;
		color: #FFFFFF;
	}
</style>
