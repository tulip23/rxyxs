<template>
	<view>
		<view class="all">
			<swiper class="index-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="2000" circular="true">
				<swiper-item v-for="(item,index) in myData.fileList" :key="index">
					<image :src="'http://image.nssnail.com/'+item.relativePath"></image>
				</swiper-item>
			</swiper>
			<view class="title">主题：{{myData.name}}</view>
			<view class="name">
				<view><span class="mySpan">开始时间	</span> {{myData.startTime}}</view>
				<view><span class="mySpan">结束时间 </span> {{myData.endTime}}</view>
			</view>
			<view class="content">
				<h3 style="font-weight: 600;">活动内容</h3>
				<view class="contents">
					{{myData.content}}
				</view>
				
			</view>
			
			<view class="three">
				<uni-icons type="person" color="orange" size="15"></uni-icons>
				<span class="myspan">{{myData.qty}} 人</span>
				<uni-icons type="star" size="15" color="red"></uni-icons>
				<span class="myspans">{{myData.integral}}分</span>
				<span class="myspans">活动时长： {{myData.duration}}</span>
			</view>
			<view class="three">
				<uni-icons type="shop" size="15" color="orange"></uni-icons>
				<span class="myspans">{{myData.redCross.mname}}</span>
			</view>
			<view class="three">
				<uni-icons type="location-filled" size="15" color="orange"></uni-icons>
				<span class="myspans">{{myData.redCross.addr}}</span>
			</view>
			<view class="time">
				<view><span class="begin">报名时间	</span> {{myData.startRegistration}}</view>
				<view><span class="begin">截止时间 </span> {{myData.endRegistration}}</view>
			</view>
			
			<view>
				<button class="btn" @tap='joinIn' :disabled="disabled">报名参加</button>
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
				sessionId:'',
				myData:{},
				disabled:true,
				currentTime:''
			}
		},
		onLoad(option) {
			this.id = parseInt(option.id)
			this.sessionId = option.sessionId
			this.init()
			this.currentTime = new Date()
			console.log(this.currentTime,'当前时间')
		},
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getActivityById',
					data:{
						id:this.id,
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data[0]
							var beginDate = new Date(this.myData.startRegistration);
							var endDate = new Date(this.myData.endRegistration);
							if(this.currentTime >= beginDate && this.currentTime <= endDate){
								this.disabled = false
							}
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
			},
			
			joinIn(){
				uni.showModal({
					title: '提示',
					content: '是否确认参加活动',
					success: (res)=> {
						if (res.confirm) {
							console.log(this.sessionId)
							uni.request({
								url:'https://www.nssnail.com/wx/participateActivity',
								method:'POST',
								withCredentials:true,
								data:{
									sessionId:this.sessionId,
									id:this.id
								},
								success: (res) => {
									console.log(res,'res')
									if(res.data.stat == 1){
										uni.showToast({
											title:'报名成功',
											icon:'success',
											duration:3000
										})
									}else{
										uni.showToast({
											title:res.data.message,
											icon:'none',
											duration:3000
										})
									}
									
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
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
	padding-bottom: 30rpx;
}
.all image{
	width: 690rpx;
	border-radius: 10rpx;
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
	position: relative;
	display: flex;
	flex-wrap: wrap;
}
.created{
	position: absolute;
	top: 0rpx;
	right: 20rpx;
	color: #BBBBBB;
}
.content{
	margin: 20rpx 10rpx;
}
.three{
	margin: 20rpx auto;
}
.myspan{
	margin: 5rpx 60rpx 10rpx 5rpx;
}
.myspans{
	margin: 5rpx 60rpx 0 5rpx;
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 180rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
}
.mySpan{
	color: orange;
	font-weight: 600;
	margin-right: 20rpx;
}
.time{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
	position: relative;
	display: flex;
	flex-wrap: wrap;
}
.begin{
	color: orange;
	font-weight: 600;
	margin-right: 20rpx;
}
.three{
	margin: 10rpx;
}
.myspan{
	margin: 5rpx 60rpx 10rpx 0;
}
.myspans{
	margin: 5rpx 60rpx 0 0;
}
.contents{
	background-color: #F9F9F9;
	width: 92%;
	margin: 10rpx auto;
	padding: 20rpx 0 20rpx 5rpx;
	border-radius: 10rpx;
}
</style>
