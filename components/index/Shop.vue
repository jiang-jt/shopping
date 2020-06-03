<template>
	<view class="shop">
		<block v-for="(item,index) in dataList" :key="index">
			<view class="shop-img">
				<image class="shop-img" :src="item.bigUrl" mode=""></image>
			</view>
			<scroll-view class="scroll-content" scroll-x="true">
				<view class="scroll-item">
					<Commodity :dataList="item.data" itemW="300rpx" bigH="300rpx" fwrap="nowrap"></Commodity>
				</view>
			</scroll-view>
		</block>
	</view>
</template>

<script>
	import Commodity from '../common/Commodity.vue'
	export default {
		props: {
			dataList: Array
		},
		components: {
			Commodity
		}
	}
</script>

<style scoped>
	.shop-img {
		width: 100%;
		height: 350rpx;
	}

	.scroll-content {
		width: 100%;
	}

	.scroll-item {
		display: inline-block;
	}
</style>
