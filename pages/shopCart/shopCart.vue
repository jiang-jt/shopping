<template>
	<view class="shop-cart">
		<template v-if="list.length>0">
			<!-- 自定义导航栏 -->
			<uniNavBar title="购物车" :right-text="isNavBar?'完成':'编辑'" fixed="true" status-bar="true" @clickRight="isNavBar = !isNavBar"></uniNavBar>
			<!-- 购物车内容 -->
			<view class="shop-list" :style="'height:'+clientHeight+'px;'">
				<view class="shop-item" v-for="(item,index) in list" :key="index">
					<label class="radio" @tap="checkedItem(index)">
						<radio value="" color="#FF3333" :checked="item.checked" /><text></text>
					</label>
					<image class="shop-img" :src="item.imgUrl" mode=""></image>
					<view class="shop-text">
						<view class="shop-name">{{item.name}}</view>
						<view class="shop-gui">颜色分类:{{item.color}} 尺码：XLshop-item</view>
						<view class="shop-price">
							<view>￥{{item.pprice}}</view>
							<template v-if="!isNavBar">
								<view>X {{item.num}}</view>
							</template>
							<template v-else>
								<uniNumberBox :min="1" :value="item.num" @change="changeNumber($event,index,item)"></uniNumberBox>
							</template>
						</view>
					</view>
				</view>
			</view>
		</template>

		<template v-else>
			<!-- 自定义导航栏 -->
			<uniNavBar title="购物车" fixed="true" status-bar="true"></uniNavBar>
			<view class="shop-else-list" :style="'height:'+clientHeight+'px;'">
				<text>您的购物车还是空的~</text>
			</view>
		</template>
		<!-- 底部 -->
		<view class="shop-foot">
			<label class="radio" @tap="checkedAllFn">
				<radio value="" :checked="checkedAll" /><text>全选</text>
			</label>
			<template v-if="!isNavBar">
				<view class="foot-total">
					<view class="total-list">
						<view>合计:<text class="total-price">￥{{totalCount.pprice}}</text></view>
						<view class="total-note">不含运费</view>
					</view>
					<view class="foot-sub" @tap="goConfirmOrder">结算（{{totalCount.num}}）</view>
				</view>
			</template>
			<template v-else>
				<view class="foot-total">
					<view class="foot-sub" style="background-color: #000000;">移入收藏夹</view>
					<view class="foot-sub" @tap="delGoodsFn">删除</view>
				</view>
			</template>
		</view>
		<TabBar currentIndex="shopCart"></TabBar>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni/uni-nav-bar/uni-nav-bar.vue"
	import uniNumberBox from "@/components/uni/uni-number-box/uni-number-box.vue"
	import TabBar from "@/components/common/Tabbar.vue"
	import $http from "@/common/api/request.js"
	import {
		mapState,
		mapActions,
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				isNavBar: false,
				clientHeight: 0
			}
		},
		computed: {
			...mapState({
				list: state => state.cart.list,
				checkedList:state=>state.cart.checkedList
			}),
			...mapGetters(["checkedAll"]),
			...mapGetters(["totalCount"])
		},
		components: {
			uniNavBar,
			uniNumberBox,
			TabBar
		},
		onShow() {
			this.getData();
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - uni.upx2px(100) - this.getClientHeight();
				}
			});
		},
		methods: {
			// 发送请求，获取购物车数据
			getData() {
				$http.request({
					url: "/getCart",
					method: "POST",
					header: {
						token: true
					}
				}).then((res) => {
					this.initCart(res.data);
				})
			},
			// 结算 跳转确认订单
			goConfirmOrder() {
				if(this.checkedList.length == 0){
					return uni.showToast({
						title:'请选择商品',
						icon:'none'
					})
				}
				uni.navigateTo({
					url: `../confirm-order/confirm-order?details=${JSON.stringify(this.checkedList)}`
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
			changeNumber(value, index, item) {
				if(this.list[index].num == value){return;}
				$http.request({
					url: "/updateNumCart",
					method: "POST",
					header: {
						token: true
					},
					data: {
						id: item.id,
						num: value
					}
				}).then((res) => {
					if (res.success) {
						this.list[index].num = value;
					} else {
						
					}
				})
			},
			...mapActions(['checkedAllFn', 'delGoodsFn']),
			...mapMutations(['checkedItem', 'initCart'])


		}
	}
</script>

<style scoped>
	.shop-cart {
		width: 100%;
		height: 100%;
		background-color: #F7F7F7;
	}

	.shop-list {
		padding-bottom: 100rpx;
	}

	.shop-else-list {
		background-color: #F7F7F7;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.shop-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.shop-img {
		width: 200rpx;
		height: 200rpx;
	}

	.radio {
		padding-left: 10rpx;
	}

	.shop-text {
		flex: 1;
		padding-left: 10rpx;
	}

	.shop-gui {
		font-size: 24rpx;
		color: #BEBEBE;
	}

	.shop-price {
		display: flex;
		justify-content: space-between;

	}

	/* 底部  */
	.shop-foot {
		position: fixed;
		bottom: 100rpx;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 2rpx solid #F7F7F7;
		background-color: #fff;
	}

	.foot-total {
		display: flex;

	}

	.total-list {
		padding-right: 10rpx;
	}

	.total-price {
		color: #49BDFB;
	}

	.total-note {
		font-size: 20rpx;
		text-align: right;
	}

	.foot-sub {
		padding: 0 60rpx;
		line-height: 100rpx;
		text-align: center;
		color: #FFFFFF;
		background-color: #49BDFB;
	}
</style>
