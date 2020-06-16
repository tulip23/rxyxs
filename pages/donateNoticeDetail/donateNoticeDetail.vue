<template>
	<view>
		<view class="all">
			<image :src="url"></image>
			<view class="title">{{myData.title}}</view>
			<view class="name">
				<uni-icons type="person-filled" color="#BBBBBB" size="15"></uni-icons>
				<span style="margin: 5rpx 10rpx;">{{myData.redCrossUser.name}}</span>
				<view class="created">{{myData.created}}</view>
			</view>
			<view class="content">{{myData.content}}</view>
			
			<view class="three">
				<uni-icons type="shop" color="orange" size="15"></uni-icons>
				<span class="myspan">{{myData.product}}</span>
				<uni-icons type="star" size="15" color="red"></uni-icons>
				<span class="myspans">{{myData.credit}}分</span>
				<span class="myspans">数量： {{myData.qty}}</span>
			</view>
			
			<view class="myInfo">
				<uni-icons type="home" size="15" color="orange"></uni-icons>
				<span style="margin: 5rpx 10rpx; font-weight: 600;">{{myData.redCross.mname}}</span>
			</view>
			
			<view class="">
				<button class="btn" @tap='donate'>捐赠</button>
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
				url:''
			}
		},
		onLoad(option) {
			this.id = option.id
			this.sessionId = option.sessionId
			this.init()
		},
		methods: {
			// 页面初始化
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getFundrasingNoticeById',
					data:{
						id:this.id,
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							this.url = 'http://image.nssnail.com/'+this.myData.file.relativePath
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
			
			// 跳转至捐赠页面
			donate(){
				console.log(this.myData.product,this.myData.qty,this.url)
				uni.navigateTo({
					url:'../donateGoods/donateGoods?sessionId='+this.sessionId+'&url='+this.url+'&product='+this.myData.product+'&qty='+this.myData.qty
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
	height: 1000rpx;
}
.all image{
	width: 690rpx;
	height: 400rpx;
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
	transform: translateY(-10rpx);
	position: relative;
}
.created{
	position: absolute;
	top: 10rpx;
	right: 20rpx;
	color: #BBBBBB;
}
.content{
	margin: 20rpx 10rpx;
}
.three{
	margin: 10rpx;
}
.myspan{
	margin: 5rpx 60rpx 10rpx 10rpx;
}
.myspans{
	margin: 5rpx 60rpx 0 10rpx;
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
	margin-top: 50rpx;
}
</style>
