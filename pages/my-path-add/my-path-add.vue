<template>
	<view class="my-path-add">
		<view class="add-item">
			<view>收件人</view>
			<input type="text" value="" placeholder="收件人姓名2-15个字符" v-model="addrInfo.name" />
		</view>
		<view class="add-item">
			<view>手机号</view>
			<input type="number" maxlength="11" value="" placeholder="11位手机号" v-model="addrInfo.tel" />
		</view>
		<view class="add-item">
			<view>所在地区</view>
			<view class="item-city">
				<input type="text" @tap="showCityPicker" disabled="true" v-model="pathCity" placeholder="请选择" />
				<view>></view>
				<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm">
				</mpvue-city-picker>
			</view>
		</view>
		<view class="add-item">
			<view>详细地址</view>
			<!-- <input type="text" value="" placeholder="5-60个字符" /> -->
			<textarea v-model="addrInfo.address" value="" placeholder="5-60个字符" maxlength="60" />
			</view>
		<view class="add-item">
			<view>邮编</view>
			<input type="text" value="" placeholder="可选填" v-model="addrInfo.postcode"/>
		</view>
		<view class="add-item">
			<view>设为默认地址</view>
			<radio-group name="" @tap="changDefault">
				<label class="radio">
					<radio value="" :checked="addrInfo.isdefault"/><text></text>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	import $http from "@/common/api/request.js"
	import mpvueCityPicker from '../../components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	import {
		mapActions
	} from "vuex"
	export default {
		computed:{
			pathCity(){
				if(this.addrInfo.province){
					return this.addrInfo.province +'-' +this.addrInfo.city + '-' +this.addrInfo.district;
				}else{
					return "请选择";
				}
			}
		},
		data() {
			return {
				ischange:false,
				pickerValueDefault: [0, 0, 1],
				cityName:'',
				addrInfo:{
					name:"",	// 收货人
					tel:"",     // 号码
					province:"", // 省 
					city:"",     // 市
					district:"", //区
					address:"",
					postcode:"",  // 邮编
					isdefault:false
				},
				// 地址列表的索引
				i:-1,
				// 是否修改
				isStatus:false
			}
		},
		components:{
			mpvueCityPicker
		},
		// 保存(监听原生标题栏按钮点击事件)
		onNavigationBarButtonTap(e){
			
			if(this.isStatus){ //修改
			
			this.addrInfo.isdefault = this.addrInfo.isdefault ? 1:0;
			$http.request({
				url: "/updateAddress",
				method: "POST",
				header:{
					token:true
				},
				data: {
					...this.addrInfo
				}
			}).then((res) => {
				if(res.success){
					uni.showToast({
						title:'修改成功',
						icon:'none'
					})
					this.updateAddrFn({
						index:this.i,
						item:this.addrInfo
					})
					uni.navigateBack({
						delta:1
					})
				}else{
					uni.showToast({
						title:'修改失败,未知错误',
						icon:'none'
					})
				}
			})
				
			}else{  // 新增
				// 跳转回到上一页,并保存内容到vuex
				this.addrInfo.isdefault = this.addrInfo.isdefault ? 1:0;
				$http.request({
					url: "/addAddress",
					method: "POST",
					header:{
						token:true
					},
					data: {
						...this.addrInfo
					}
				}).then((res) => {
					uni.showToast({
						title:'添加成功',
						icon:'none'
					})
					this.addAddrFn(this.addrInfo);
					uni.navigateBack({
						delta:1
					})
				})
			}
		},
		onLoad(e) {
			if(e.data){
				uni.setNavigationBarTitle({
					title:'修改地址'
				})
				let result = JSON.parse(e.data);
				this.addrInfo = result.item;
				this.i = result.index;
				this.isStatus = true;
			}
		},
		methods: {
			// 显示选择城市三级联动
			showCityPicker() {
			      this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e) {
				let arr = e.label.split('-');
				this.addrInfo.province = arr[0];
				this.addrInfo.city = arr[1];
				this.addrInfo.district = arr[2];
				
			  // this.addrInfo.city = e.label; 
			},
			...mapActions(['addAddrFn','updateAddrFn']),
			changDefault(){
				 this.addrInfo.isdefault = !this.addrInfo.isdefault;
			}
		}
	}
</script>

<style scoped>
.my-path-add{
	padding: 20rpx;
}
.add-item{
	display: flex;
	justify-content: space-between;
	
	border-bottom: 2rpx solid #E1E1E1;
	padding: 20rpx 0;
}
.add-item input{
	flex: 1;
	text-align: left;
	padding-left: 10rpx;
	
}
.add-item textarea{
	flex: 1;
	height: 100rpx;
	text-align: left;
	padding-left: 10rpx;
}
.add-item radio-group{
	flex: 1;
	padding-left: 10rpx;
}
.item-city{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
