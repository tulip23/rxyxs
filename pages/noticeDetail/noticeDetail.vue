<template>
	<view>
		<view class="all">
			<view class="title">{{myData.title}}</view>
			<view class="created">{{myData.created}}</view>
			<view class="name">
				<uni-icons type="person-filled" color="#BBBBBB" size="15"></uni-icons>
				<span style="margin: 5rpx 10rpx;">{{myData.redCrossUser.name}}</span>
			</view>
			<h3 style="font-weight: 600; margin-left: 10rpx;">公告内容：</h3>
			<view class="content">
				<text style="margin-left: 10rpx;">{{myData.content}}</text>
			</view>
			<view class="myInfo">
				<uni-icons type="home" size="15" color="#BBBBBB"></uni-icons>
				<span style="margin: 5rpx 10rpx;">{{myData.redCross.mname}}</span>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		data() {
			return {
				id:'',
				myData:{},
				sessionId:''
			}
		},
		onLoad(option) {
			this.id = option.id
			this.sessionId = option.sessionId
			this.init()
		},
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getNoticeById',
					data:{
						id:this.id,
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
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
		},
		components:{
			uniIcons
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
}
.title{
	font-size: 30rpx;
	font-weight: 600;
	margin: 20rpx 0 0 10rpx;
	padding-top: 10rpx;
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
	margin: 10rpx 10rpx;
	color: #BBBBBB;
}
.name{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
	transform: translateY(-10rpx);
}
.created{
	position: absolute;
	top: 70rpx;
	right: 20rpx;
	color: #BBBBBB;
}
.content{
	margin: 20rpx 10rpx;
	background-color: #F9F9F9;
	padding: 20rpx 0;
	border-radius: 10rpx;
}
</style>
