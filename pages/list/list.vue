<template>
	<!-- 每一个类型的商品的查询是通过id去查询的 -->
	<view>
		<Lines></Lines>
		<view class="list">
			<!-- 右侧的数据和左侧的tab点击有关，点击时给点击事件传递一个id，然后根据该id去请求对于的右侧数据 -->
			<!-- 左侧滑动 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height:'+clientHeight+'px;'">
				<view class="left-item" v-for="(item,index) in leftData" :key="index" @tap="changeLeftTab(index,item.id)">
					<view class="item-name" :class="activeIndex === index?'item-name-active':''">{{item.name}}</view>
				</view>
			</scroll-view>

			<!-- 右侧滑动 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height:'+clientHeight+'px;'">
				<view class="right-list" v-for="(item,index) in rightData" :key="index">
					<block v-for="(k,i) in item">
						<view class="list-title">{{k.name}}</view>
						<view class="right-content">
							<view class="right-item" v-for="(j,idx) in k.list" :key="idx">
								<image class="right-img" :src="j.imgUrl" mode=""></image>
								<view class="right-name">{{j.name}}</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<TabBar currentIndex="list"></TabBar>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import Lines from "@/components/common/line.vue"
	import TabBar from "@/components/common/Tabbar.vue"
	export default {
		data() {
			return {
				clientHeight: 0,
				activeIndex: 0,
				leftData: [],
				rightData:[]
			}
		},
		methods: {
			// 左侧点击事件
			changeLeftTab(index,id) {
				// 点击时请求数据
				this.getData(id);
				this.activeIndex = index;
				
			},
			// 请求数据
			getData(id) {
				// 判断是否是重复点击,避免重复请求
				if(id === this.activeIndex+1){
					return ;
				}
				$http.request({
					url: "/goods/list"
				}).then((res) => {
					let leftData = [];
					let rightData =[];
					res.forEach(item => {
						leftData.push({
							id: item.id,
							name: item.name
						})
						if(item.id === this.activeIndex+1){
							rightData.push(item.data);
						}
					})
					this.leftData = leftData;
					this.rightData = rightData;
				})
			}
		},
		// 获取可视高度
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - uni.upx2px(80);
				}
			});
			this.getData();
		},
		components: {
			Lines,
			TabBar
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../search/search'
			})
		}
	}
</script>

<style scoped>
	.list {
		display: flex;
		justify-content: space-between;
	}

	.list-left {
		width: 200rpx;
	}

	.list-right {
		flex: 1;
		padding-left: 30rpx;
	}

	.left-item {
		background-color: #F7F7F7;
		border-bottom: 2rpx solid #FFFFFF;
		font-size: 28rpx;
	}

	.item-name {
		padding: 24rpx 6rpx;
		text-align: center;
	}

	.item-name-active {
		border-left: 8rpx solid #007AFF;
		background-color: #FFFFFF;
	}

	.list-title {
		font-weight: bold;
		padding: 30rpx 0;
	}

	.right-content {
		display: flex;
		flex-wrap: wrap;
	}

	.right-item {
		width: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
	}

	.right-img {
		width: 150rpx;
		height: 150rpx;
	}

	.right-name {}
</style>
