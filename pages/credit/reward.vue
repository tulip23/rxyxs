<template>
	<view>
		<view class="myTop" v-for="(item,index) in userInfo" :key="index">
			<template v-if="item != null">
				<view class="fist"><span class="mySpan">奖励</span></view>
				<view class="two">
					<view class="mytitle">奖励分数</view>
					<view class="myInfo">{{item.integral}}</view>
				</view>
				<view class="two">
					<view class="mytitle">奖励理由</view>
					<view class="myInfo">{{item.message}}</view>
				</view>
			</template>
			
			<template v-else>
				<view class="title">没有奖励信息</view>
			</template>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				userInfo:[
					{
						integral:'无',
						message:'无'
					}
				],
				sessionId:''
			}
		},
		computed: mapState(['hasLogin','uerInfo']),
		onLoad(option) {
			this.sessionId = option.sessionId
			this.init()
		},
		methods: {
			...mapMutations(['login']),
			// 页面渲染
			init(){
				uni.getStorage({
					key:'userInfo',
					success: (res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/personal/getRewardAndPunishmentRecord',
							data:{
								sessionId:this.sessionId
							},
							success: (res) => {
								if(res.data.stat == 1){
									res.data.data.forEach((item)=>{
										if(item.type == 1){
											this.userInfo = res.data.data
										}
									})
									console.log(res,'返回的信息')
								}else if(res.data.stat == 3){
									uni.showModal({
										title: '提示',
										content: '登录过期，请重新登录',
										success: function (res) {
											if (res.confirm) {
												uni.navigateTo({
													url:'../myInit/myInit'
												})
											}
										}
									});
								}
								
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
.navbar{
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
}
.tabdiv{
	display: inline-block;
	width: 50%;
	text-align: center;
	color: #969696;
	font-weight: bolder;
	font-size: 32rpx;
	border-bottom: #FFFFFF solid 2rpx;
	padding: 20rpx 0;
}
.active{
	border-bottom: #ffd33f solid 6rpx;
	margin: auto;
}
.list{
	width: 97%;
	margin: 20rpx auto;
	border-radius: 10rpx;
}
.myTop{
	width: 95%;
	margin: 20rpx auto;
	background-color: white;
	position: relative;
	border-radius: 10rpx;
	padding: 10rpx 0;
}
.fist{
	width: 100%;
	font-size: 30rpx;
	font-weight: 600;
	position: relative;
	border-bottom: 1rpx solid #F1F1F1;
	padding: 10rpx 0;
}
.two{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	border-bottom: 2rpx solid #F1F1F1;
	margin: 15rpx auto;
	padding: 15rpx 0;
}
.mytitle{
	font-size: 30rpx;
}
.myInfo{
	margin-right: 20rpx;
	font-size: 30rpx;
	color: #969696;
}
.edit{
	width: 100rpx;
	position: absolute;
	top: 5rpx;
	left: 600rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #007AFF;
}
.mySpan{
	margin-left: 30rpx;
}
.title{
	width: 100%;
	text-align: center;
	padding: 20rpx 0;
	font-size: 30rpx;
}
</style>
