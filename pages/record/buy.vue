<template>
	<view>
		<view class="all" v-for="(item,index) in myData" :key="index">
			<view class="title">
				竞拍物品：
				<span style="color: orange;">{{item.auctionVo.name}}</span>
				<view class="price">当前价格：<span class="myspan">￥{{item.auctionVo.price}}</span></view>
			
			</view>
			<view class="two">
				<image :src="'http://image.nssnail.com/'+item.auctionVo.fileList[0].relativePath"></image>
				<image :src="'http://image.nssnail.com/'+item.auctionVo.fileList[1].relativePath"></image>
			</view>

			<view style="margin-left: 10rpx;">物品类型：{{item.auctionVo.type}}</view>
			<view class="created">开始时间：{{item.auctionVo.startTime}}</view>
			<view class="stat">
				{{item.stat}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				sessionId:'',
				myData:[]
			}
		},
		
		onLoad(option) {
			this.sessionId = option.sessionId
			this.init()
		},
		
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/personal/getAuctionRecord',
					// method:'POST',
					data:{
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							this.myData.forEach((item)=>{
								if(item.stat == 1){
									item.stat = '未拍卖'
								}else if(item.stat == 2){
									item.stat = '拍卖中'
								}else if(item.stat == 3){
									item.stat = '已拍卖'
								}else{
									item.stat = '失效'
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
			},
			
			// 跳转至详情页
			gotoNoticeDetail(item){
				var id = item.id
				uni.navigateTo({
					url:'../donateNoticeDetail/donateNoticeDetail?id='+id
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
	padding-bottom: 10rpx;
}
.two{
	width: 100%;
	margin-left: 5rpx;
}
.two image{
	width: 320rpx;
	height: 320rpx;
	border-radius: 10rpx;
	margin: 0 13rpx;
	display: inline-block;
}
.title{
	font-size: 30rpx;
	margin: 0 0 0 10rpx;
	padding-top: 10rpx;
	position: relative;
}
.stat{
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	color: #BBBBBB;
}
.created{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
}
.price{
	position: absolute;
	left: 410rpx;
	top: 10rpx;
	font-size: 30rpx;
}
.myspan{
	color: orange;
	font-weight: 600;
	font-size: 30rpx;
}
.myaddr{
	width: 100%;
	margin-left: 15rpx;
}
</style>
