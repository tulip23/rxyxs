<template>
	<view>
		<view class="all">
			<swiper class="index-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
				<swiper-item v-for="(item,index) in myData.fileList" :key="index">
					<image :src="'http://image.nssnail.com/'+item.relativePath"></image>
				</swiper-item>
			</swiper>
			<view class="name">
				<span style="margin: 5rpx 10rpx;">{{myData.stat}}</span>
				<view class="created" v-if="myData.stat == '未拍卖'">
					<span>距开始剩</span>
					<span class="timer"><uni-countdown :day="d" :hour="h" :minute="m" :second="s"></uni-countdown></span>
				</view>
				<view class="created" v-else-if="myData.stat == '拍卖中'">
					<span>距截至剩</span>
					<span class="timer"><uni-countdown :day="d" :hour="h" :minute="m" :second="s"></uni-countdown></span>
					
				</view>
			</view>
			<view class="content">{{myData.content}}</view>
		</view>
		<view class="three">
			<view class="oneTags">当前价：<span class="mySpan">￥{{myData.price}}</span></view>
			<view class="oneTags">有效时长： <span class="mySpan">{{myData.validTime}}</span>小时</view>
		</view>
		
		<!-- 竞拍用户列表 -->
		<view class="second" v-if="myData.stat == '拍卖中'">
			<view class="myInfo">
				<view class="showList" v-for="(item,index) in user" :key="index" v-if="myData.user != null">
					<view class="userList">
						<uni-icons type="person" size="20" color="orange"></uni-icons>
						<span class="user">{{item.user}}</span>
						<span class="myprice">￥{{item.price}}</span>
					</view>
					<view class="mystat">{{item.stat}}</view>
				</view>
				<view v-if="myData.user == null" class="noneone">
					当前无人竞拍…
				</view>
			</view>
		</view>
		<view class="theLast">
			<button class="btn" @tap='add' :disabled="disabled">加价</button>
		</view>
		
		<uni-popup ref="popup" type="center">
			<view class="myPop">
				<view class="mytitle">您的出价（不低于105%）</view>
				<view class="pop">
					<input class="numbers" v-model="myPrice" :placeholder="myTips" />
				</view>
				<button @tap="submit">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	export default {
		data() {
			return {
				id:'',
				disabled:true,
				sessionId:'',
				myData:{},
				user:[{
						price:'120',
						user:'luckydog',
						stat:'出价最高'
					}],
				d:'',
				h:'',
				m:'',
				n:'',
				myPrice:'',
				myTips:'',
				bidPrice:''
			}
		},
		onLoad(option){
			this.id = option.id
			this.sessionId = option.sessionId
			this.init()
		},
		
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getAuctionById',
					data:{
						id:this.id,
						sessionId:this.sessionId
					},
					success:(res)=>{
						console.log(res)
						if(res.data.stat == 1){
							this.myData = res.data.data
							if(this.myData.stat == 1){
								this.myData.stat = '未拍卖'
								this.disabled = true
								this.clock()
							}else if(this.myData.stat == 2){
								this.myData.stat = '拍卖中'
								this.disabled = false
								this.clock2()
							}else if(this.myData.stat == 3){
								this.myData.stat = '已拍卖'
							}else{
								this.myData.stat = '已失效'
							}
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
			},
			
			
			// 竞拍
			add(){
				uni.showModal({
					title:'提示',
					content:'是否参与竞拍？',
					success:(res)=>{
						this.$refs.popup.open()
						this.myPrice = ''
						this.bidPrice = this.myData.price * 1.05
						this.myTips = '不低于'+this.bidPrice
					}
				})
			},
			
			// 参与竞拍
			submit(){
				console.log(this.myPrice,this.sessionId)
				if(this.myPrice < this.bidPrice){
					uni.showToast({
						title:'加价不得低于'+this.bidPrice,
						icon:'none',
						duration:3000
					})
				}else{
					uni.request({
						url:'https://www.nssnail.com/wx/userBidding',
						method:'POST',
						data:{
							sessionId:this.sessionId,
							id:this.id,
							price:this.myPrice
						},
						success: (res) => {
							if(res.data.stat == 1){
								uni.showToast({
									title:res.data.message,
									icon:'success'
								})
								this.$refs.popup.close()
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
							}else if(res.data.stat == 0){
								uni.showToast({
									title:res.data.message,
									icon:'none',
									duration:3000
								})
								this.$refs.popup.close()
							}
						}
					})
				}

			},
			
			// 时间戳倒计时  未开始
			clock(){
				var date = new Date();
				var now = date.getTime();//获得当前时间与1970年1月1日时间相差的毫秒数
				var star = this.myData.startTime
				var endDate = new Date(star); 
				var end = endDate.getTime();//结束时间与1970年1月1日时间相差的毫秒数
				var leftTime = end-now;//计算两日期之间相差的毫秒数
				if (leftTime >= 0) {
					this.d = Math.floor(leftTime/1000/60/60/24);
					this.h = Math.floor(leftTime/1000/60/60%24);  
					this.m = Math.floor(leftTime/1000/60%60);  
					this.s = Math.floor(leftTime/1000%60);
					console.log(this.d+'天'+this.h+'时'+this.m+'分'+this.s+'秒')
				}
			},
			
			// 已经开始
			clock2(){
				var date = new Date();
				var now = date.getTime();
				var star = this.myData.startTime
				var endDate = new Date(star); 
				var end = endDate.getTime(); 
				var leftTime = end-now;
				if (leftTime >= 0) {
					this.d = Math.floor(leftTime/1000/60/60/24);  
					this.h = this.myData.validTime+Math.floor(leftTime/1000/60/60%24);  
					this.m = Math.floor(leftTime/1000/60%60);  
					this.s = Math.floor(leftTime/1000%60);
					console.log(this.d+'天'+this.h+'时'+this.m+'分'+this.s+'秒')
				}
			}
		},
		
		components:{
			uniCountdown
		}
	}
</script>

<style scoped>
.all{
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
	position: relative;
	background-color: white;
	padding-bottom: 20rpx;
}
.all image{
	width: 690rpx;
	height: 400rpx;
	border-radius: 10rpx;
}
.name{
	width: 100%;
	height: 70rpx;
	color: white;
	line-height: 70rpx;
	position: relative;
	background-color: #FF3333;
	border-radius: 10rpx;
}
.created{
	width: 400rpx;
	position: absolute;
	top: 10rpx;
	right: 20rpx;
}
.content{
	margin: 20rpx 10rpx;
}
.three{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	background-color: white;
	height: 100rpx;
	line-height: 120rpx;
	margin: 10rpx auto;
}
.oneTags{
	height: 100rpx;
	line-height: 100rpx;
	margin: 0 20rpx;
}
.mySpan{
	color: red;
}
.second{
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
	position: relative;
	background-color: white;
	padding-bottom: 20rpx;
	border-radius: 10rpx;
}
.showList{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	height: 100rpx;
	border-bottom: 1rpx solid #CCCCCC;
}
.user{
	line-height: 100rpx;
	display: inline-block;
	width: 200rpx;
}
.myprice{
	color: red;
}
.userList{
	width: 80%;
}
.mystat{
	width: 130rpx;
	background-color: red;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	border-radius: 20rpx;
	margin: 17rpx 10rpx;
	text-align: center;
}
.theLast{
	width: 100%;
	background-color: white;
	position: absolute;
	bottom: 0;
	height: 120rpx;
}
.btn{
	background-color: red;
	font-size: 28rpx;
	width: 80%;
	height: 90rpx;
	line-height: 90rpx;
	color: white;
	font-weight: 600;
	border-radius: 30rpx;
	margin-top: 15rpx;
}
.timer{
	position: absolute;
	top: -3rpx;
	right: -10rpx;
}
.noneone{
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
	font-weight: 600;
}
.myPop{
	height: 400rpx;
	width: 600rpx;
	margin: 30rpx auto;
	display: flex;
	flex-wrap: wrap;
	background-color: white;
	justify-content: center;
}
.myPop button{
	background-color: orange;
	font-size: 28rpx;
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	font-weight: 600;
	margin-top: 20rpx;
}
.mytitle,.pop{
	width: 92%;
	margin: 20rpx auto;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
}
.pop{
	margin: 0 auto;
	/* border: #DDDDDD; */
}
.numbers{
	height: 100rpx;
	border: #DDDDDD solid 1rpx;
}
</style>
