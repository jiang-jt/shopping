<template>
	<view class="index">
		<!-- 滑动切换tabBar的实现:
通过scroll-view   和swiper 的@change 和 current 联动实现
 
 -->
		<scroll-view scroll-x="true" class="scroll-content" :scroll-into-view="scrollTopIndex" scroll-with-animation="true">
			<view :id="'top'+index" class="scroll-item" v-for="(iten,index) in tabBar" :key="index" @click="tabChange(index)">
				<text :class="topBarIndex===index?'f-active-color':'f-color'">{{iten.name}}</text>
			</view>
		</scroll-view>

		<!-- 计算可视区的高的方法在IOS中是有问题的 这里使用uni-app的API获取元素的内容高度-->
		<swiper @change="swiperChange" :current="topBarIndex" :style="'height:'+clientHeight+'px;'">
			<swiper-item v-for="(item,index) in mainData" :key="index">
				<scroll-view refresher-enabled="true" :refresher-triggered="triggered" @refresherrestore="onRestore" scroll-y="true"
				 @refresherrefresh="onRefresh" :style="'height:'+clientHeight+'px;'" @scrolltolower="loadmore">
					<block v-if="item.data.length>0">
						<block v-for="(k,i) in item.data" :key="i">
							<!--  推荐 -->
							<!-- 首页swiper -->
							<indexSwiper v-if="k.type=='swiperList'" :dataList="k.data"></indexSwiper>
							<!-- 店铺推荐 -->
							<template v-if="k.type=='recommendList'">
								<Recommend :dataList="k.data"></Recommend>
								<!-- 猜你喜欢 (卡片) -->
								<Card title="猜你喜欢"></Card>
							</template>

							<!-- （其他）运动户外  .. . -->
							<Banner v-if="k.type=='bannerList'" :dataList="k.data"></Banner>
							<template v-if="k.type=='iconList'">
								<Icon :dataList="k.data"></Icon>
								<Card title="超级大牌"></Card>
							</template>
							<template v-if="k.type=='superStarList'">
								<SuperStar :dataList="k.data"></SuperStar>
								<Card title="热销爆品"></Card>
							</template>
							<template v-if="k.type=='hotList'">
								<Hot :dataList="k.data"></Hot>
								<Card title="推荐店铺"></Card>
							</template>
							<template v-if="k.type=='shopList'">
								<Shop :dataList="k.data"></Shop>
								<Card title="为您推荐"></Card>
							</template>

							<!-- 商品列表 -->
							<CommodityList v-if="k.type=='commodityList'" :dataList="k.data"></CommodityList>

						</block>
					</block>
					<block v-else>
						<view>暂无数据...</view>
					</block>
				</scroll-view>
			</swiper-item>
		</swiper>
		<TabBar currentIndex="index"></TabBar>
	</view>
</template>

<script>
	import indexSwiper from "@/components/index/indexSwiper.vue"
	import Recommend from "@/components/index/recommend.vue"
	import Card from "@/components/common/Card.vue"
	import CommodityList from "@/components/common/CommodityList.vue"
	import Banner from "@/components/index/Banner.vue"
	import Icon from "@/components/index/Icon.vue"
	import SuperStar from "@/components/index/SuperStar.vue"
	import Hot from "@/components/index/Hot.vue"
	import Shop from "@/components/index/Shop.vue"
	import TabBar from "@/components/common/Tabbar.vue"
	import $http from "@/common/api/request.js"
	export default {
		data() {
			return {
				title: 'Hello',
				// 顶部导航栏内容
				tabBar: [],
				// 顶部导航当前选中索引
				topBarIndex: 0,
				// 顶部导航当前选中索引的id值
				scrollTopIndex: 'top0',
				// 内容块的高度值
				clientHeight: "",
				// 主体内容[推荐商铺，swiper，商品列表]
				mainData: [],
				triggered: true
			}
		},
		onLoad() {
			this.__init();
		},
		// 获取可视高度
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - uni.upx2px(180);
				}
			});
		},
		onShow() {},
		// 点击导航栏触发
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				uni.navigateTo({
					url: '../search/search'
				})
			}
		},
		methods: {
			// 请求首页数据
			__init() {
				$http.request({
					url: "/index_list/data"
				}).then((res) => {
					this.tabBar = res.topBar;
					this.mainData = this.initData(res);
				})
			},
			// 添加数据
			initData(res) {
				let arr = [];
				for (let i = 0; i < this.tabBar.length; i++) { // 遍历topBar的长度，swiper的内容数量和topBar数量对应
					let obj = { // 定义一个空对象
						data: [],
						load: "first"
					};
					if (i == 0) { // 
						obj.data = res.data;
					}
					arr.push(obj);
				}
				return arr;
			},
			// 点击顶栏触发
			tabChange(index) {
				if (this.topBarIndex === index) {
					return;
				}
				this.topBarIndex = index;
				this.scrollTopIndex = 'top' + index;

				if (this.mainData[this.topBarIndex].load === "first") {
					this.addData();
				}
			},
			// 对应滑动
			swiperChange(e) { // current 改变时调用
				this.tabChange(e.detail.current)
			},
			// 计算高度[兼容处理]
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return 44 + res.statusBarHeight;
				} else if (system === 'android') {
					return 48 + res.statusBarHeight;
				} else {
					return 0;
				}
			},
			// 添加对应topBar的内容
			addData() { //
				let index = this.topBarIndex;
				let id = this.tabBar[index].id;
				// 计算页数、
				let page = Math.ceil(this.mainData[index].data.length / 6) + 1;
				
				$http.request({
					url: `/index_list/${id}/data/${page}`
				}).then((res) => {
					this.mainData[index].data = [...this.mainData[index].data, ...res];
				})

				this.mainData[index].load = "finish"
			},
			// 上拉加载更多
			loadmore() {
				this.addData();
			},
			// 下拉刷新
			onPulling(e) { // 自定义下拉刷新控件被下拉

			},
			onRefresh() { //自定义下拉刷新被触发
				setTimeout(() => {
					this.triggered = false;
				}, 1000);
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			}
		},
		components: {
			indexSwiper,
			Recommend,
			Card,
			CommodityList,
			Banner,
			Icon,
			SuperStar,
			Hot,
			Shop,
			TabBar
		}
	}
</script>

<style scoped>
	.wx-nav {
		height: 200rpx;
		width: 100%;
		line-height: 200rpx;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.scroll-content {
		width: 100%;
		height: 80rpx;
		white-space: nowrap;
	}

	.scroll-item {
		display: inline-block;
		font-size: 32rpx;
		padding: 10rpx 30rpx;
	}

	.f-active-color {
		padding: 10rpx 0;
		border-bottom: 6rpx solid #49BDFB;
	}
</style>
