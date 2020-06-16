<script>
	import {mapMutations} from 'vuex'
	export default {
		onLaunch: function() {
			uni.getStorage({//获得保存在本地的用户信息
				key: 'uerInfo',  
				success:(res) => {  
					this.login(res.data);
				}  
			});
		}
		,
		methods:{
			...mapMutations(['login'])  
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
	/*每个页面公共css */
	/* 引入官方css库 */
	 @import './common/uni.css';
	 /* 引入自定义图标库 */
	 @import './common/icon.css';
	 /* 引入动画库 */
	 @import './common/animate.css';
	 page{
	 	background-color: #F9F9F9;
	 }
</style>
