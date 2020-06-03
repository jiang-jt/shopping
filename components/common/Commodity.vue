<template>
	<view class="commodity" :style="'flex-wrap:'+fwrap+';'">
		<view class="commodity-item" v-for="data in dataList" :key="data.id" :style="'width:'+itemW+';'" @tap="toDetails(data.id)">
			<image class="commodity-img" :src="data.imgUrl" mode="" :style="'height:'+bigH+';'"></image>
			<view class="commodity-content" >
				<text class="commodity-name" :style="'font-size:'+fSize+';'">{{data.name}}</text>
				<view class="">
					<text class="pprice">￥{{data.pprice}}</text>
					<text class="oprice">￥{{data.oprice}}</text>
				</view>
				<text class="discount">{{data.discount}}折</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: {}
			},
			itemW: {
				type: String,
				default: "373rpx"
			},
			bigH: {
				type: String,
				default: "375rpx"
			},
			fwrap:{
				type:String,
				default:"wrap"
			},
			fSize:{
				type:String,
				default:"26rpx"
			}
		},
		methods:{
			toDetails(id){
				uni.navigateTo({
					url:'../../pages/details/details?id='+id+''
				})
			}
		}
	}
</script>

<style scoped>
	.commodity {
		display: flex;
		justify-content: space-between;
	}

	.commodity-item {
		width: 371rpx;
		padding-bottom: 20rpx;
	}

	.commodity-img {
		width: 100%;
		height: 375rpx;
	}

	.commodity-content {
		text-align: center;
	}

	.commodity-name {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #333333;
		word-break: break-all;
		padding: 6rpx 20rpx;
	}

	.oprice {
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999999;
	}

	.discount {
		border-radius: 4rpx;
		border: 2rpx solid #FF3333;
		color: #FF3333;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
	}
</style>
