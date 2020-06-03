<template>
	<view class="my" :style="'height:'+clientHeight+'px;'">
		<!-- uni-app提供了状态栏高度的css变量 -->
		<view class="status_bar">

		</view>
		<!-- 头部 -->
		<view class="my-header">
			<view class="header-main">
				<view class="header-config">
					<image @tap="goConfig" class="config-img" src="../../static/img/config.png" mode=""></image>
				</view>
				<view class="header-logo">
					<view>
						<image class="logo-img" :src="loginStatus?userInfo.imgUrl:''" mode=""></image>
						<view class="logo-name">{{userInfo.nickName || userInfo.phone }}</view>
					</view>
				</view>
				<view class="header-xiaoxi">
					<view class="iconfont icon-xiaoxi"></view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<view class="order">
			<view class="order-title">
				<view>我的订单</view>
				<view @tap="goOrder">全部订单 ></view>
			</view>
			<view class="order-list">
				<view class="order-item">
					<image class="item-img" src="../../static/img/order1.png" mode=""></image>
					<view class="item-name">待付款</view>
				</view>
				<view class="order-item">
					<image class="item-img" src="../../static/img/order2.png" mode=""></image>
					<view class="item-name">待发货</view>
				</view>
				<view class="order-item">
					<image class="item-img" src="../../static/img/order3.png" mode=""></image>
					<view class="item-name">待收货</view>
				</view>
				<view class="order-item">
					<image class="item-img" src="../../static/img/order4.png" mode=""></image>
					<view class="item-name">待评价</view>
				</view>
				<view class="order-item">
					<image class="item-img" src="../../static/img/order5.png" mode=""></image>
					<view class="item-name">退款管理</view>
				</view>
			</view>
		</view>
		<!-- 菜单列表 -->
		<view class="my-content">
			<view class="content-list">
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-shoucang"></view>
					</view>
					<view class="item-content">
						<view>我的收藏</view>
						<view>></view>
					</view>
				</view>
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-youhuijuan"></view>
					</view>
					<view class="item-content">
						<view>我的优惠券</view>
						<view>></view>
					</view>
				</view>
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-wodejifen"></view>
					</view>
					<view class="item-content">
						<view>我的积分</view>
						<view>></view>
					</view>
				</view>
			</view>

			<view class="content-list">
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-vip-chao"></view>
					</view>
					<view class="item-content">
						<view>加入超级VIP</view>
						<view>></view>
					</view>
				</view>
			</view>

			<view class="content-list">
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-bangzhu"></view>
					</view>
					<view class="item-content">
						<view>帮助中心</view>
						<view>></view>
					</view>
				</view>
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-kefu"></view>
					</view>
					<view class="item-content">
						<view>联系客服</view>
						<view>></view>
					</view>
				</view>
				<view class="content-item">
					<view class="item-icon">
						<view class="iconfont icon-shangjia"></view>
					</view>
					<view class="item-content">
						<view>商家入驻</view>
						<view>></view>
					</view>
				</view>
			</view>

		</view>
		<TabBar currentIndex="my"></TabBar>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import TabBar from "@/components/common/Tabbar.vue"
	export default {
		data() {
			return {
				clientHeight: 0
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				loginStatus: state => state.user.loginStatus
			})
		},
		onReady() {
			// 计算可视区高度
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight;
				}
			});
		},
		methods: {
			// 跳转我的订单页面
			goOrder() {
				uni.navigateTo({
					url: '../my-order/my-order'
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
			goConfig() {
				uni.navigateTo({
					url: '../my-config/my-config'
				})
			}
		},
		components: {
			TabBar
		}
	}
</script>

<style scoped>
	.my {
		background-color: #E7E7E7;
	}

	/* 头部 */
	.my-header {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 400rpx;
		background-image: url(../../static/img/mybg.png);
		background-repeat: no-repeat;
	}

	.config-img {
		width: 50rpx;
		height: 50rpx;
		margin: 30rpx;
	}

	.header-logo {
		position: absolute;
		width: 120rpx;
		height: 140rpx;
		top: 50%;
		left: 50%;
		margin-left: -60rpx;
		margin-top: -70rpx;
	}
	
	.header-logo >view{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo-img {
		width: 120rpx;
		height: 120rpx;
		border: 2rpx solid #FFFFFF;
		border-radius: 50%;
	}

	.logo-name {
		white-space: nowrap;
		line-height: 60rpx;
		color: #FFFFFF;
		text-align: center;
	}

	.header-xiaoxi {
		position: absolute;
		right: 0;
		top: 0;
		margin: 30rpx;
		color: #FFFFFF;
	}

	/* 我的订单 */
	.order {
		background-color: #fff;
	}

	.order-title {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
	}

	.order-list {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.item-img {
		width: 50rpx;
		height: 50rpx;

	}

	.item-name {
		padding: 10rpx 0;
		font-size: 24rpx;
	}

	/* 菜单内容 */
	.content-list {
		margin: 20rpx 0;
		padding-left: 60rpx;
		background-color: #fff;
	}

	.content-item {
		display: flex;
		justify-content: space-between;
		padding: 10rpx;
		border-bottom: 2rpx solid #E1E1E1;
	}

	.item-icon {
		margin-left: -60rpx;
		padding-right: 20rpx;
	}

	.item-icon .iconfont {
		font-size: 34rpx;
	}

	.item-content {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
