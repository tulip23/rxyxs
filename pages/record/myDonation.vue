<template>
	<view>
		<view class="allContent">
			<view class="total" v-for="(item,index) in myData" :key="index">
				<view class="name">
					<uni-icons type="shop" color="orange" size="15"></uni-icons>
					<span style="margin: 5rpx 10rpx;">{{item.redCross.mname}}</span>
				</view>
				<view class="left">
					<view>
						<image :src="'http://image.nssnail.com/'+item.fileList[0].relativePath"></image>
					</view>
				</view>
				
				<view class="myTwo">
					<view>物品：<span class="myspan">{{item.product}}</span></view>
					<!-- <view>信誉度：<span class="myspan">{{item.credit}}</span></view> -->
					<view>捐赠数量：<span class="myspan">{{item.qty}}</span></view>
				</view>
				
				<view class="right">
					<view>捐赠时间：{{item.created}}</view>
					<view class="stat">{{item.stat}}</view>
				</view>
			</view>
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
			console.log(this.sessionId)
			this.init()
		},
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/personal/getDonatorRecord',
					data:{
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							this.myData.forEach((item)=>{
								if(item.stat == 1){
									item.stat = '募捐中'
								}else if(item.stat == 2){
									item.stat = '已取消'
								}
							})
						}else if(res.data.stat == 3 || res.data.stat == 4){
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
.allContent{
	width: 92%;
	margin: 0 auto;
	border-radius: 10rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}
.total{
	display: flex;
	flex-wrap: wrap;
	padding: 10rpx 0 20rpx 0;
	margin-top: 20rpx;
	background-color: white;
	border-radius: 10rpx;
	position: relative;
}
.left{
	margin: 20rpx;
	display: flex;
	flex-wrap: nowrap;
	position: relative;
}
.left image{
	width: 650rpx;
	height: 400rpx;
	border-radius: 15rpx;
}
.right{
	width: 100%;
	margin-left: 15rpx;
}
.stat{
	width: 200rpx;
	left: 450rpx;
	font-size: 25rpx;
	position: absolute;
	bottom: 12rpx;
	text-align: right;
	color: #BBBBBB;
}
.name{
	width: 100%;
	margin-left: 10rpx;
}
.price{
	right: 70rpx;
	top: 150rpx;
	color: red;
	font-size: 35rpx;
	font-weight: 600;
	position: absolute;
}
.prices{
	right: 70rpx;
	top: 200rpx;
	color: #BBBBBB;
	font-size: 20rpx;
	position: absolute;
}
.myspan{
	color: black;
	font-size: 20rpx;
}
.type{
	width: 100%;
	margin: 10rpx;
	color: #BBBBBB;
}
.myTwo{
	width: 94%;
	margin: 20rpx auto;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
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
