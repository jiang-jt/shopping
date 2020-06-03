<template>
	<view class="details">
		<!-- 商品详情轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<image class="swiper-img" :src="goodsContent.imgUrl" mode=""></image>
			</swiper-item>
		</swiper>
		<!-- 商品价格、名称 -->
		<view class="details-goods">
			<view class="goods-pprice">￥{{goodsContent.pprice}}</view>
			<view class="goods-oprice">￥{{goodsContent.oprice}}</view>
			<view class="goods-name">{{goodsContent.name}}</view>
		</view>
		<!-- 商品详情图 -->
		<view>
			<view>
				<image class="details-img" src="../../static/img/detail1.jpg" mode=""></image>
			</view>
			<view>
				<image class="details-img" src="../../static/img/detail2.jpg" mode=""></image>
			</view>
			<view>
				<image class="details-img" src="../../static/img/detail3.jpg" mode=""></image>
			</view>
			<view>
				<image class="details-img" src="../../static/img/detail4.jpg" mode=""></image>
			</view>
			<view>
				<image class="details-img" src="../../static/img/detail5.jpg" mode=""></image>
			</view>
		</view>

		<!-- 商品列表 -->
		<Card title="看了又看"></Card>
		<CommodityList :dataList="dataList"></CommodityList>

		<!-- 底部 -->
		<view class="details-footer">
			<view class="iconfont icon-xiaoxi"></view>
			<view class="iconfont icon-che" @tap="goShopCart"></view>
			<view class="add-shopcart" @tap="showPop">加入购物车</view>
			<view class="purchase" @tap="showPop">立即购买</view>
		</view>

		<!-- 底部弹出层    @touchmove.stop.prevent：取消默认的行为-->
		<view class="pop" v-if="isShow" @touchmove.stop.prevent="">
			<view class="pop-mask" @tap="hidePop"></view>
			<view class="pop-box" :animation="animationData">
				<view class="pop-header">
					<view class="pop-header-img">
						<image class="pop-header-img" :src="goodsContent.imgUrl" mode=""></image>
					</view>
					<view class="pop-header-title">
						<view class="title-price">￥148.00-199.00</view>
						<view>可购2800件</view>
						<view>请选择颜色分类 适用尺寸</view>
					</view>
				</view>
				<scroll-view class="scroll-pop" scroll-y="true">
					<view class="pop-midd-list">
						<!-- 规格选择 -->
						<view class="">
							<view class="list-item">
								<view class="item-title">颜色分类</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
							</view>
							<view class="list-item">
								<view class="item-title">颜色分类</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
								<view class="item-tag f-color">爱丽丝</view>
							</view>
						</view>
						<!-- 购买数量 -->
						<view class="midd-footer">
							<view>购买数量</view>
							<uniNumberBox :min="1" :value="num" @change="changeNumber"></uniNumberBox>
						</view>
					</view>
				</scroll-view>
				<view class="pop-sub" @tap="addCart">
					确定
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import Card from "@/components/common/Card.vue"
	import CommodityList from "@/components/common/CommodityList.vue"
	import uniNumberBox from "../../components/uni/uni-number-box/uni-number-box.vue"
	import $http from "@/common/api/request.js"
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// 弹出层动画
				animationData: {},
				// 商品信息
				goodsContent: {},
				// 是否弹出弹出层
				isShow: false,
				// 推荐商品
				dataList: [{
						id: 1,
						imgUrl: "../../static/img/commodity1.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/commodity2.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/commodity3.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/commodity4.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				],
				// 商品数量
				num: 1
			}
		},
		onLoad(e) {
			this.getData(e.id)
		},
		// 修改返回事件
		onBackPress() {
			if (this.isShow) {
				this.hidePop()
				return true;
			}
		},
		// 分享
		onNavigationBarButtonTap(e) {
			if (e.type === 'share') {
				uni.share({
					"provider": "weixin",
					"type": 0,
					"title": this.goodsContent.name,
					"scene": "WXSceneSession",
					"href": `http://192.168.0.5:8081/pages/details/details?id=1#/pages/details/details?id=${this.goodsContent.id}`,
					"imageUrl": this.goodsContent.imgUrl,
					"success": function() {
						uni.showToast({
							title: "分享成功",
							type: "none"
						})
					}
				})
			}
		},
		methods: {
			...mapMutations(['addShopCart']),
			// 加入到购物车
			addCart() {
				// 加入购物车是往当前用户的购物车数据中增加一条数据,所以需要验证是否登录
				// 验证： 通过在header头部加上token进行验证
				$http.request({
					url: "/addCart",
					method: "POST",
					header: {
						token: true
					},
					data: {
						id: this.goodsContent.id, // 商品id
						num: this.num // 添加商品数量
					}
				}).then((res) => {
					// 隐藏弹出层
					this.hidePop();
					uni.showToast({
						title: '成功添加到购物车',
						icon: 'none'
					})
				})
			},
			// 跳转到购物车
			goShopCart() {
				uni.redirectTo({
					url: '../shopCart/shopCart'
				})
			},
			// 修改商品数量,uniNumber改变时触发
			changeNumber(value) {
				this.num = value
			},
			// 请求数据
			getData(id) {
				$http.request({
					url: "/goods/id",
					data: {
						id
					}
				}).then((res) => {
					this.goodsContent = res[0];
				})
			},
			// 弹出层
			showPop() {
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'linear',
				})
				this.animation = animation
				animation.translateY(600).step();
				this.animation = animation.export();

				setTimeout(() => {
					animation.translateY(0).step();
					this.animation = animation.export();
					this.isShow = true;
				}, 200)
			},
			hidePop() {
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'linear',
				})
				this.animation = animation
				animation.translateY(600).step();
				this.animation = animation.export();
				setTimeout(() => {
					animation.translateY(0).step();
					this.isShow = false;
				}, 200)
			}
		},
		components: {
			CommodityList,
			Card,
			uniNumberBox
		}
	}
</script>

<style scoped>
	.details {
		padding-bottom: 90rpx;
	}

	swiper {
		width: 100%;
		height: 700rpx;
	}

	.swiper-img {
		width: 100%;
		height: 700rpx;
	}

	.details-goods {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		padding: 10rpx 0;
	}

	.goods-oprice {
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999999;
	}

	.details-img {
		width: 100%;
	}

	/* 底部 */
	.details-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 90rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: #fff;

	}

	.details-footer .iconfont {
		width: 60rpx;
		height: 60rpx;
		font-size: 30rpx;
		line-height: 60rpx;
		border-radius: 100%;
		background-color: #000;
		color: #FFFFFF;
		margin: 0 10rpx;
		text-align: center;
	}

	.add-shopcart {
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: #000;
		color: #FFFFFF;
		border-radius: 40rpx;
	}

	.purchase {
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: #49BDFB;
		color: #FFFFFF;
		border-radius: 40rpx;
	}

	/* 底部弹出层 */
	.pop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
	}

	.pop-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.pop-box {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		padding: 10rpx;
	}

	/* 弹出层内容样式 */
	.pop-header {
		padding: 20rpx;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #E1E1E1;
		display: flex;
		height: 160rpx;
	}

	.pop-header-img {
		width: 170rpx;
		height: 170rpx;
		padding: 4rpx;
		margin-top: -30rpx;
	}

	.pop-header-title {
		flex: 1;
		margin-left: 10rpx;
	}

	.title-price {
		color: #49BDFB;
		font-size: 36rpx;
	}

	.pop-sub {
		background-color: #42B7FB;
		width: 100%;
		height: 80rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		text-align: center;
		line-height: 80rpx;
		color: #FFFFFF;
	}

	.scroll-pop {
		height: 400rpx;
		padding-bottom: 80rpx;
	}

	.list-item {
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #E1E1E1;
	}

	.item-title {
		padding: 16rpx 0;
		font-size: 28rpx;
	}

	.item-tag {
		display: inline-block;
		padding: 4rpx 24rpx;
		background-color: #E1E1E1;
		font-size: 24rpx;
		border-radius: 26rpx;
		margin: 10rpx;
	}

	.midd-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #E1E1E1;

	}
</style>
