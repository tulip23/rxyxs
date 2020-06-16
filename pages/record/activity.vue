<template>
	<view>
		<view class="all" v-for="(item,index) in myData" :key="index">
			<template v-if="item.activity != null">
				<view class="title">
					<uni-icons type="flag" color="red" size="15"></uni-icons>
					<span style="margin-left: 20rpx;">{{item.activity.name}}</span>
				</view>
				<view class="created">{{item.created}}</view>
				<view class="mname">
					<view class="myInfo">活动内容：{{item.activity.content}}</view>
				</view>
				<view class="two">
					<view>活动开始时间：<span class="myspan">{{item.activity.startTime}}</span></view>
					<view>活动结束时间：<span class="myspan">{{item.activity.endTime}}</span></view>
				</view>
				<view class="name">
					<view>活动时长：<span class="myspan">{{item.activity.duration}}</span></view>
					<view>信誉度:<span class="myspan">{{item.activity.integral}}</span></view>
					<view class="stat">{{item.stat}}</view>
				</view>
			</template>
			
			<template v-else>
				<view class="title">
					<uni-icons type="flag" color="red" size="15"></uni-icons>
					<span style="margin-left: 20rpx;">{{item.stat}}</span>
				</view>
			</template>
		</view>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {
				sessionId:'',
				myData:[],
			}
		},
		onLoad(option) {
			this.sessionId = option.sessionId
			this.init()
		},
		methods: {
			// 页面渲染
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/personal/getActivityRecord',
					// method:'POST',
					data:{
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							this.myData.forEach((item)=>{
								if(item.stat == 1){
									item.stat = '参加'
								}else{
									item.stat = '取消'
								}
							})
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
		}
	}
</script>

<style scoped>
.all{
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
	position: relative;
	padding-bottom: 20rpx;
}
.title{
	font-size: 30rpx;
	font-weight: 600;
	margin: 20rpx 0 0 10rpx;
	padding-top: 10rpx;
}
.mname{
	width: 100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	margin: 10rpx 10rpx;
}
.mytitle{
	font-size: 30rpx;
	color: #BBBBBB;
}
.myInfo{
	text-align: left;
	width: 60%;
	margin-right: 20rpx;
	font-size: 30rpx;
}
.name{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	margin: 10rpx 10rpx;
	justify-content: space-between;
}
.two{
	margin: 10rpx 10rpx;
}
.created{
	position: absolute;
	top: 130rpx;
	right: 20rpx;
	color: #BBBBBB;
}
.myspan{
	color: orange;
	font-size: 30rpx;
	font-weight: 500;
}
.stat{
	color: red;
	font-size: 30rpx
}
</style>
