<template>
	<view class="confirm-order bg-gray-color">
		<Lines></Lines>
		<!-- 收货人信息 -->
		<view class="order-head" @tap="goPathConfig">
			<template v-if="path">
				<view class="head-l">定位</view>
				<view class="head-m">
					<view class="head-m-name">
						<view>收货人:{{path.name}}</view>
						<view>{{path.tel}}</view>
					</view>
					<view class="f-color head-m-addr">收货地址:{{path.province}}{{path.city}}{{path.district}}{{path.address}}</view>
				</view>
				<view class="head-r f-color">></view>
			</template>
			<template v-else>
				<view class="no-addr">请添加收货地址</view>
			</template>
		</view>
		<!-- 商品信息 -->
		<view class="goods-info">
			<view class="goods-item" v-for="(item,index) in getList" :key="index">
				<view class="item-head bg-gray-color">
					<image class="goods-img" :src="item.imgUrl" mode=""></image>
					<view class="goods-title">
						<view class="title-l">
							<view>{{item.name}}</view>
							<view class="f-color">颜色分类：黑色 尺码：54</view>
							<view class="f-active-color" style="font-size: 24rpx;">7天无理由</view>
						</view>
						<view class="title-r">
							<view>￥{{item.pprice}}</view>
							<view class="f-color" style="text-align: right;">X{{item.num}}</view>
						</view>
					</view>
				</view>
				<view class="shop-info">
					<view class="f-b">
						<view>店铺满折</view>
						<view>省￥14.9</view>
					</view>
					<view class="f-b">
						<view>运费</view>
						<view>0.00</view>
					</view>
					<view class="f-b">
						<view>留言</view>
						<input type="text" value="" placeholder="给卖家留言,140字以内" />
					</view>
					<view class="goods-total">
						<view>共1件商品 小计:</view>
						<view class="f-active-color">￥{{parseInt(item.pprice)*parseInt(item.num)}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部提交订单按钮 -->
		<view class="confirm-order-foot">
			<view class="foot-content">
				<view>合计</view>
				<view class="f-active-color">￥{{totalCount.pprice}}</view>
			</view>
			<view class="foot-btn" @tap="goPayment">
				提交订单
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from "../../components/common/line.vue"
	import $http from "@/common/api/request.js"
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				path: false,
				selectId: []
			}
		},
		computed: {
			...mapState({
				list: state => state.cart.list,
				pathList: state => state.path.list
			}),
			...mapGetters(["defaultPath", "totalCount"]),
			getList() {
				return this.selectId.map(id => {
					return this.list.find(v => v.id == id)
				})
			}
		},
		onLoad(e) {
			$http.request({
				url: "/selectAddress",
				method: "POST",
				header: {
					token: true
				}
			}).then((res) => {
				this.initAddress(res.data);
				// 如果有默认地址
				if (this.defaultPath.length) {
					this.path = this.defaultPath[0];
				}
			})

			// 页面通信
			uni.$on("selectedPathItem", (res) => {
				this.path = res;
			})
			this.selectId = JSON.parse(e.details);
		},
		onUnload() {
			uni.$off("selectedPathItem", () => {
				console.log("移除了");
			})
		},
		methods: {
			...mapMutations(['initAddress']),
			// 跳转地址选择
			goPathConfig() {
				uni.navigateTo({
					url: '../path-config/path-config?type=selectedPath'
				})
			},
			// 跳转支付页面
			goPayment() {
				if (!this.path) {
					return uni.showToast({
						title: "请选择收货地址",
						icon: "none"
					})
				}
				uni.navigateTo({
					url: `../payment/payment?commodityId=${JSON.stringify(this.selectId)}`
				})
			}
		},
		components: {
			Lines
		}
	}
</script>

<style scoped>
	.confirm-order {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	/* 收货人信息 */
	.order-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
	}

	.head-l {
		width: 40rpx;
		padding-right: 20rpx;
	}

	.head-m {
		flex: 1;
	}

	.head-m-name {
		display: flex;
		justify-content: space-between;
		font-weight: bold;
	}

	.head-m-addr {
		font-size: 24rpx;
	}

	.head-r {
		width: 40rpx;
		padding-left: 20rpx;
	}

	/* 添加收货地址 */

	.no-addr {
		font-weight: bold;
	}

	/* 商品信息 */
	.goods-info {
		margin-top: 20rpx;

		background-color: #fff;
	}

	.item-head {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-img {
		width: 140rpx;
		height: 140rpx;
		padding-right: 20rpx
	}

	.goods-title {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.title-l {
		flex: 1;
	}

	.title-r {
		padding-left: 20rpx;
	}

	.f-b {
		display: flex;
		justify-content: space-between;
		border-bottom: 2rpx solid #E1E1E1;
		padding: 20rpx 0;
	}

	.f-b input {
		flex: 1;
		padding-left: 20rpx;
	}

	.shop-info {
		padding: 20rpx;
		background-color: #fff;
	}

	.goods-total {
		padding: 20rpx 0;
		display: flex;
		justify-content: flex-end;
	}

	/* 底部提交订单 */
	.confirm-order-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 90rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.foot-content {
		display: flex;
		padding-right: 20rpx;
	}

	.foot-btn {
		color: #FFFFFF;
		background-color: #49BDFB;
		padding: 0 60rpx;
		line-height: 90rpx;
	}
</style>
