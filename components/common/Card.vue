<template>
	<view class="card">
		<view>-</view>
		<slot>
			<view class="card-name">{{title}}</view>
		</slot>
		<view>-</view>
	</view>
</template>

<script>
	export default{
		props:["title"]
	}
</script>

<style scoped>
	.card{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx 0;
		font-weight: bold;
	}
	.card-name{
		padding: 0 20rpx;
		font-size: 32rpx;
	}
</style>
