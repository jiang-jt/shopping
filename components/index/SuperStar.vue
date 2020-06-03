<template>
	<view class="superStar">
		<block v-for="(item,index) in dataList" :key="index">
		<image class="superStar-img" :src="item.imgUrl" mode=""></image>
		</block>
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
	.superStar{
		display: flex;
		flex-wrap: wrap;
	}
	.superStar-img{
		width: 25%;
		height: 150rpx;
		padding: 2rpx;
		box-sizing: border-box;
	}
	
</style>
