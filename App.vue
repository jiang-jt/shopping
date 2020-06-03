<script>
	export default {
		onLaunch: function() {
			this.$store.commit("initUser");
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "./common/uni.css";
	@import "./common/common.css";
	@import "./common/iconfont.css";
	/*每个页面公共css */
	/* 取消滚动条 */
	::-webkit-scrollbar {  
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	/* uni-app提供了状态栏高度的css变量--status-bar-height */
	.status_bar {
	  height: var(--status-bar-height);
	  width: 100%;
	}
</style>
