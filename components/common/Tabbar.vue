<template>
	<view class="tabBar">
		<view class="tab-item" v-for="(item,index) in tabBarList" :key="index" @tap="goNavigator(item.pagePath)">
			<image v-if="item.pagePath === currentIndex" :src="item.selectedIconPath" mode=""></image>
			<image v-else :src="item.iconPath" mode=""></image>
			<view class="">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBarList: [{
					"pagePath": "index",
					"iconPath": "/static/tabbar/index.png",
					"selectedIconPath": "/static/tabbar/indexSelected.png",
					"text": "首页"
				}, {
					"pagePath": "list",
					"iconPath": "/static/tabbar/list.png",
					"selectedIconPath": "/static/tabbar/listSelected.png",
					"text": "分类"
				}, {
					"pagePath": "shopCart",
					"iconPath": "/static/tabbar/shop.png",
					"selectedIconPath": "/static/tabbar/shopSelected.png",
					"text": "购物车"
				}, {
					"pagePath": "my",
					"iconPath": "/static/tabbar/my.png",
					"selectedIconPath": "/static/tabbar/mySelected.png",
					"text": "我的"
				}],
			}
		},
		props: {
			currentIndex: {
				type: String,
				default: 'index'
			}
		},
		methods: {
			goNavigator(path) {
				if(this.currentIndex == path) return ;
				if (path === "my" || path === "shopCart") {
					return this.redirectTo({
						url: `../../pages/${path}/${path}`,
						animationType:'fade-in',
						animationDuration:0
					})
				} else {
					uni.redirectTo({
						url: `../../pages/${path}/${path}`
					})
				}
			}
		}
	}
</script>

<style scoped>
	.tabBar {
		border-top: 2rpx solid #E1E1E1;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.tab-item image {
		width: 40rpx;
		height: 40rpx;
	}
</style>
