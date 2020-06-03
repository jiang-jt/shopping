<template>
	<view class="icon">
		<view class="icon-item" v-for="(item,index) in dataList" :key="index">
			<image class="icon-img" :src="item.imgUrl" mode=""></image>
			<text class="f-color">{{item.name}}</text>
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
	.icon{
		display: flex;
		flex-wrap: wrap;
	}
	.icon-item{
		
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 10rpx;
	}
	.icon-img{
		background-color: #00B7FF;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}
	
</style>
