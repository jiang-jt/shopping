<template>
	<view>
		<Lines></Lines>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-lajitongshanchu" @tap="clearHistory">
				</view>
			</view>
			<view v-if="searchData.length >0">
				<view class="search-name f-color" v-for="(item,index) in searchData" :key="index" @tap="toSearchList(item)">{{item}}</view>
			</view>
			<view v-else>
				<view class="search-rec">暂无最近搜索记录</view>
			</view>
		</view>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">热门搜索</view>
			</view>
			<view>
				<view class="search-name f-color">花菜</view>
				<view class="search-name f-color">四件套</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from "../../components/common/line.vue"
	export default {
		components: {
			Lines
		},
		data() {
			return {
				keyword: '',
				searchData: []
			}
		},
		// 页面加载
		onLoad() {
			uni.getStorage({
				key: "searchData",
				success: (res) => {
					this.searchData = JSON.parse(res.data);
				}
			})
		},
		// 监听原生标题栏input变化事件
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text;

		},
		// 监听软键盘的搜索按钮的点击事件
		onNavigationBarSearchInputConfirmed() {
			this.searchShop();
		},
		// 监听标题栏搜索按钮点击事件
		onNavigationBarButtonTap(e) {
			this.searchShop();
		},
		methods: {
			// 点击搜索记录进入页面
			toSearchList(keyword) {
				uni.navigateTo({
					url: '../search-list/search-list?keyword=' + keyword + ''
				})
			},
			// 搜索商品
			searchShop() {
				if (this.keyword === "") {
					uni.showToast({
						title: '请输入关键字搜索',
						icon: 'none'
					})
				} else {
					this.toSearchList(this.keyword);
					uni.hideKeyboard();

					this.addSearch();
				}
			},
			// 记录最近搜索词
			addSearch() {
				let idx = this.searchData.indexOf(this.keyword);
				if (idx < 0) {
					// 在最前面添加搜索词
					this.searchData.unshift(this.keyword);
				} else {
					this.searchData.unshift(this.searchData.splice(idx, 1)[0]);
				}
				// 使用本地存储
				uni.setStorage({
					key: "searchData",
					data: JSON.stringify(this.searchData)
				})
			},
			// 删除最近搜索记录
			clearHistory() {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除吗',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorage({
								key: 'searchData'
							})
							this.searchData = [];
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.search-item {
		padding: 30rpx;
	}

	.search-title {
		display: flex;
		justify-content: space-between;
	}

	.search-name {
		padding: 4rpx 24rpx;
		background-color: #E1E1E1;
		border-radius: 26rpx;
		display: inline-block;
		margin: 10rpx;
	}

	.search-rec {
		text-align: center;
	}
</style>
