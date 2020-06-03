<template>
	<view class="shop-list">
		<view class="shop-title f-color">
			<view class="shop-item" v-for="(item,index) in shopList.data" :key="index" @tap="changeTap(index)">
				<view :class="shopList.currentIndex === index ? 'f-active-color':'f-color'">{{item.name}}</view>
				<view class="shop-icon">
					<view class="iconfont icon-shangjiantou up" :class="item.status===1?'f-active-color':'f-color'"></view>
					<view class="iconfont icon-icon down" :class="item.status===2?'f-active-color':'f-color'"></view>
				</view>
			</view>
		</view>
		<!-- 分割线 -->
		<Lines></Lines>
		<!-- 商品展示 -->
		<CommodityList :dataList="dataList"></CommodityList>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import Lines from "@/components/common/line.vue"
	import CommodityList from "@/components/common/CommodityList.vue"
	export default {
		components: {
			Lines,
			CommodityList
		},
		data() {
			return {
				shopList: {
					currentIndex: 0,
					data: [{ // status:1：升序   2:降序
							name: "价格",
							status: 1,
							key: 'pprice'
						},
						{
							name: "折扣",
							status: 0,
							key: 'discount'
						},
						{
							name: "品牌",
							status: 0
						}
					]
				},
				dataList: []
			}
		},
		computed: {
			orderBy() {
				// 获取当前选择的对象
				let index = this.shopList.currentIndex;
				if (index === 2) {
					index = 0;
				}
				let obj = this.shopList.data[index];
				// 判断当前的orderBy
				let order = obj.status == 1 ? 'asc' : 'desc';
				return {
					[obj.key]: order
				}
			}
		},
		props: {
			keyword: String
		},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {   // 后期优化可以加上分页。
				console.log(this.orderBy)
				$http.request({
					url: "/goods/search",
					data: {
						name: this.keyword,
						...this.orderBy
					}
				}).then((res) => {
					this.dataList = res;
				})
			},
			// 点击商品筛选后
			changeTap(index) {
				// 获取旧的值
				let idx = this.shopList.currentIndex;
				// 获取具体哪一个对象
				let item = this.shopList.data[idx];
				// 做切换
				if (idx == index) {
					item.status = item.status === 1 ? 2 : 1;
					this.getData();
					return;
				}
				let newItem = this.shopList.data[index];
				// 移除旧的
				item.status = 0;
				newItem.status = 1;
				// 字体颜色切换
				this.shopList.currentIndex = index;
				this.getData();

			}
		}
	}
</script>

<style scoped>
	.shop-title {
		display: flex;
	}

	.shop-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.shop-icon {
		position: relative;
	}

	.iconfont {
		font-size: 30rpx;
		height: 8rpx;
		position: absolute;
	}

	.up {
		top: -34rpx;
	}

	.down {
		top: -24rpx;
	}
</style>
