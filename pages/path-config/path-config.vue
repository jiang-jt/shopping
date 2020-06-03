<template>
	<view class="path-config">
		<view class="path-list">
			<view v-for="(item,index) in list" :key="index" @tap="toUpdatePath(index)">
				<view class="path-item" @tap="goConfigOrder(item)">
					<view class="item-title">
						<view class="title-name">{{item.name}}</view>
						<view>{{item.tel}}</view>
					</view>
					<view class="item-path">
						<view class="path-mo" v-if="item.isdefault ==1?true:false">默认</view>
						<view class="item-addr">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-path">
			<view class="add-btn" @tap="goAddPath">新增地址</view>
		</view>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import {
		mapState,mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				isSelectedPath: false
			}
		},
		computed: {
			...mapState({
				list: state => state.path.list
			})
		},
		onLoad(e) {
			if (e.type === 'selectedPath') { // 用来判断是否是从确认订单跳转过来的
				this.isSelectedPath = true;
			}
			this.__initAddress();
		},
		methods: {
			...mapMutations(['initAddress']),
			// 初始化收货地址,请求接口,获取当前用户所对应的收货地址,然后存储到store中
			__initAddress() {
				$http.request({
					url: "/selectAddress",
					method: "POST",
					header:{
						token:true
					}
				}).then((res) => {
					this.initAddress(res.data);
				})
			},
			// 跳转回到确认订单页面
			goConfigOrder(item) {
				if (this.isSelectedPath) {
					// 自定义事件，页面通讯
					uni.$emit("selectedPathItem", item);
					uni.navigateBack({
						delta: 1
					})
				}
			},
			// 修改
			toUpdatePath(index) {
				let obj = JSON.stringify({
					index: index,
					item: this.list[index]
				});
				uni.navigateTo({
					url: "../my-path-add/my-path-add?data=" + obj + ""
				})
			},
			// 新增
			goAddPath() {
				uni.navigateTo({
					url: '../my-path-add/my-path-add'
				})
			}
		}
	}
</script>

<style scoped>
	/* 新增地址 */
	.add-path {
		width: 100%;
		padding-top: 20rpx;
		display: flex;
		justify-content: center;

	}

	.add-btn {
		padding: 10rpx 80rpx;
		border: 2rpx solid #49BDFB;
		color: #49BDFB;
		border-radius: 30rpx;
	}

	/* 地址信息 */
	.path-list {
		width: 100%;
		padding: 20rpx;
	}

	.path-item {
		padding: 20rpx 0;
		border-bottom: 2rpx solid #CCCCCC;
	}

	.item-title,
	.item-path {
		display: flex;
		align-items: center;
	}

	.title-name {
		padding-right: 20rpx;
	}

	.path-mo {
		color: #FFFFFF;
		background-color: #49BDFB;
		border-radius: 20rpx;
		font-size: 20rpx;
		padding: 4rpx 16rpx;
		margin-right: 20rpx;
	}

	.item-addr {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		padding-right: 20rpx;
	}
</style>
