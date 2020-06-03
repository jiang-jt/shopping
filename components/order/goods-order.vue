<template>
	<view class="goods-order">
		<view v-for="(k,i) in dataList" :key="i">
			<view class="order-item"  v-for="(item,j) in k.goods_item" :key="j">
				<!-- 状态（待支付） -->
				<view class="main-title">
					<label class="radio">
						<radio value="" /><text></text>
					</label>
					<view class="f-active-color">{{k.status}}</view>
				</view>
				<!-- 商品信息 -->
				<view class="goods-info">
					<image class="goods-img" :src="item.imgUrl" mode=""></image>
					<view class="info-list">
						<view>
							<view>{{item.name}}</view>
							<view class="goods-gui f-color">颜色:{{item.attrs}}</view>
							<view class="f-active-color">7天无理由</view>
						</view>
						<view style="padding-left: 16rpx;">
							<view>￥{{item.pprice}}</view>
							<view style="text-align: right;">X{{item.num}}</view>
						</view>
					</view>
				</view>
				<!-- 合计 -->
				<view class="goods-total">
					合计：<view class="f-active-color">￥{{item.pprice*item.num}}</view>(含运费:￥0.00)
				</view>
				<!-- 支付 -->
				<view class="goods-pay">
					<view class="pay-btn">支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
				dataList:Array
			}
	}
</script>

<style scoped>
	.order-item{
		margin-top: 10rpx;
	}
	/* 商品状态 */
	.main-title{
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
	}
	/* 商品信息 */
	.goods-info{
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		padding: 20rpx;
	}
	/* 商品图 */
	.goods-img{
		width: 140rpx;
		height: 140rpx;
		padding-right: 20rpx;
	}
	/* 详情 */
	.info-list{
		flex: 1;
		display: flex;
		flex-direction: space-between;
	}
	.goods-gui{
		font-size: 24rpx;
	}
	/* 合计 */
	.goods-total{
		display: flex;
		padding: 20rpx;
		justify-content: flex-end;
		padding-right: 20rpx;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #E1E1E1;
	}
	/* 支付 */
	.goods-pay{
		padding: 20rpx;
		width: 100%;
		background-color: #FFFFFF;
		text-align: right;
	}
	.pay-btn{
		display: inline-block;
		padding: 4rpx 40rpx;
		border: 2rpx solid #49BDFB;
		color: #49BDFB;
		border-radius: 30rpx;
		margin-right: 30rpx;
	}
</style>
