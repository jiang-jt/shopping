<template>
	<view class="my-order bg-gray-color">
		<!-- 顶部 -->
		<view class="my-order-top">
			<Lines></Lines>
			<!-- 选项栏 -->
			<view class="tab-list">
				<view class="tab-item" v-for="(item,index) in tabList" :key="index" :class="tabIndex === index?'active':'tab-item'"
				 @tap="changeTab(index)">
					{{item.name}}</view>
			</view>
		</view>
            <view style="margin-top: 90rpx;"></view>
			<block v-for="(tabItem,idx) in tabList" :key="idx">
				<!-- 显示顶部栏选择对于数据 -->
				<view v-if="idx===tabIndex">
					<!-- 订单内容 -->
					<view class="order-main" v-if="tabItem.list.length>0">
						<!-- 遍历商品信息 -->
						<goods-order :dataList="tabItem.list"></goods-order>

						<!-- 底部全选/立即支付 -->
						<view v-if="tabItem.name=='待付款'" class="order-foot">
							<label class="radio">
								<radio value="" /><text>全选</text>
							</label>
							<view class="foot-btn">
								立即支付
							</view>
						</view>
					</view>

					<view class="no-order" v-else :style="'height:'+clientHeight+'px;'">
						<view>您还没有相关订单</view>
						<view class="no-order-btn" @tap="goIndex">去首页逛逛</view>
					</view>
				</view>
			</block>
	</view>
</template>

<script>
	import Lines from "@/components/common/line.vue"
	import goodsOrder from "@/components/order/goods-order.vue"
	export default {
		data() {
			return {
				clientHeight: 0,
				// 当前选中索引
				tabIndex: 0,
				// 顶部选项栏内容
				tabList: [{
						name: "全部",
						list: [{
							status: "待付款",
							goods_item: [{
									imgUrl: "../../static/img/hot1.jpg",
									name: "【自营】阿迪达斯运动鞋爆款，休闲运动鞋6554/KBS",
									attrs: "黑色",
									pprice: "2999.00",
									num: "3",
								},
								{
									imgUrl: "../../static/img/hot1.jpg",
									name: "【自营】阿迪达斯运动鞋爆款，休闲运动鞋6554/KBS",
									attrs: "黑色",
									pprice: "2999.00",
									num: "3",
								}
							]
						}]
					},
					{
						name: "待付款",
						list: []
					},
					{
						name: "待发货",
						list: []
					},
					{
						name: "待收货",
						list: []
					},
					{
						name: "待评价",
						list: []
					}
				]
			}
		},
		onReady() {
			// 计算可视区高度
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight-uni.upx2px(90);
				}
			});
		},
		methods: {
			// tab栏切换
			changeTab(index) {
				this.tabIndex = index;
			},
			goIndex(){
				uni.redirectTo({
					url:'../index/index'
				})
			}
		},
		components: {
			Lines,
			goodsOrder
		}
	}
</script>

<style scoped>
	.my-order-top{
		position: fixed;
		/* height: 90rpx; */
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.my-order {
		width: 100%;
		overflow-x: hidden;
	}

	.tab-list {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 2rpx solid #E1E1E1;
		background-color: #FFFFFF;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		line-height: 90rpx;
		box-sizing: border-box;
	}

	.active {
		border-bottom: 4rpx solid #49BDFB;
	}

	/* 订单商品列表 */
	.order-main {}

	/* 底部支付 */
	.order-foot {
		width: 100%;
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
	}

	.foot-btn {
		padding: 0 40rpx;
		color: #FFFFFF;
		height: 100%;
		background-color: #49BDFB;
		line-height: 90rpx;
	}

	.radio {
		padding-left: 20rpx;
	}

	/* 无订单 */
	.no-order {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.no-order-btn {
		padding: 10rpx 80rpx;
		border: 2rpx solid #49BDFB;
		color: #49BDFB;
		border-radius: 40rpx;
		margin-top: 10rpx;
	}
</style>
