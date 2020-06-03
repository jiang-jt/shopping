<template>
	<view class="my-config">
		<Lines></Lines>
		<!-- 设置项 -->
		<view class="config-list">
			<view class="config-item">
				<view>账号设置</view>
				<view class="item-mark"></view>
			</view>
			<!-- 编辑个人资料 -->
			<view class="config-item">
				<view class="item-left">
					<image class="item-img" src="../../static/img/Children1.jpg" mode=""></image>
					<view class="item-name">用户昵称</view>
				</view>
				<view class="item-right">
					<view class="item-write">编辑个人资料</view>
					<view class="item-mark">></view>
				</view>
			</view>
			<view class="config-item">
				<view>修改密码</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>绑定手机号码</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item" @tap="goPathConfig">
				<view>地址管理</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>绑定第三方账号</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>系统设置</view>
				<view class="item-mark"></view>
			</view>
			<view class="config-item">
				<view>消息推送</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>短信提醒</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>图片显示</view>
				<view class="item-right">
					<view style="font-weight: bold;">智能模式</view>
					<view class="item-mark">></view>
				</view>
			</view>
			<view class="config-item">
				<view>清除缓存</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>支持</view>
				<view class="item-mark"></view>
			</view>
			<view class="config-item">
				<view>给百年奥莱好评</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>意见反馈</view>
				<view class="item-mark">></view>
			</view>
			<view class="config-item">
				<view>关于百年奥莱</view>
				<view class="item-mark">></view>
			</view>
		</view>
		<!-- 退出按钮 -->
		<view class="config-exit">
			<view class="config-exit" @tap="logOut">
				退出
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from '@/components/common/line.vue'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations(["loginOut"]),
			goPathConfig(){
				uni.navigateTo({
					url:'../path-config/path-config'
				})
			},
			logOut(){
				uni.showToast({
					title:"退出成功",
					icon:"none"
				})
				this.loginOut();
				uni.redirectTo({
					url:'../index/index'
				})
			}
		},
		components:{
			Lines
		}
	}
</script>

<style scoped>
	
.config-list{
	padding-left: 20rpx;
}

.config-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #E1E1E1;
}

.item-mark{
	padding: 0rpx 20rpx;
}

.item-img{
	width: 80rpx;
	height: 80rpx;
	border: 2rpx solid #E1E1E1;
	border-radius: 50%;
}

.item-left{
	display: flex;
	align-items: center;
}

.item-name{
	padding-left: 20rpx;
}

.item-right{
	display: flex;
	align-items: center;
	
}
.item-write{
	color: #CCCCCC;
}
	
.config-exit{
	margin-top: 20rpx;
	width: 100%;
	background-color: #49BDFB;
	color: #FFFFFF;
	text-align: center;	
	line-height: 70rpx;
}
</style>
