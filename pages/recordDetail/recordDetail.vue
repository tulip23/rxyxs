<template>
	<view>
		<view class="allContent">
			<view class="total">
				<view class="left">
					<swiper class="index-swiper" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="1000" circular="true">
						<swiper-item v-for="(item,index) in myData.fileList" :key="index">
							<image :src="'http://image.nssnail.com/'+item.relativePath"></image>
						</swiper-item>
					</swiper>
				</view>
				
				<view class="right">
					<h3 style="font-weight: 600;">商品描述：</h3>
					<view class="desc">{{myData.goods.description}}</view>
					
					<view class="two">
						<view class="type">类型：{{myData.goods.type}}</view>
						<view class="qty">购买数量：{{myData.qty}}</view>
						<view class="price">￥ {{myData.price}}<span class="myspan">.00</span></view>
					</view>
					
					<view class="my">
						<view class="mytitle">{{myData.created}}</view>
						<view class="mystat">{{myData.stat}}</view>
					</view>
				</view>
			</view>
			
			<!-- 弹窗 -->
			<uni-popup ref="popup" type="center">
				<view class="all">
					<view class="pay">支付密码</view>
					<view class="password-input">
						<view class="input-number">
							<block v-for="(num,index) in chat" :key="index">
								<view class="number">{{chat == ''?'':num}}</view>
							</block>
						</view>
					</view>
					<!-- 键盘 -->
					<view class="keyword">
						<block v-for="(number,index) in keyNumberList" :key="index">
							<view class="keyNumber" hover-start-time="200" hover-class="keyNumberBg" @tap.stop="clickNum(index)">{{number}}
							</view>
						</block>
					</view>
				</view>
			</uni-popup>
			
			<button class="btn" @tap='sure' :disabled="disabled">支付订单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sessionId:'',
				id:'',
				myData:{},
				disabled:false,
				keyNumberList:[1,2,3,4,5,6,7,8,9,0,'.','支付'],
				number:[],
				chat:[]
			}
		},
		onLoad(option) {
			this.sessionId = option.sessionId
			this.id = option.id
			this.init()
		},
		
		methods: {
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getOrderDetail',
					data:{
						sessionId:this.sessionId,
						id:this.id
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							if(this.myData.stat == 1){
								this.myData.stat = '未付款'
								this.disabled = false
							}else if(this.myData.stat == 2){
								this.myData.stat = '已付款(未发货)'
								this.disabled = false
							}else if(this.myData.stat == 3){
								this.myData.stat = '失效'
								this.disabled = true
							}else{
								this.myData.stat = '已发货'
								this.disabled = true
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
			
			// 支付订单
			sure(){
				this.$refs.popup.open()
				this.number = []
				this.chat = []
			},
			
			// 提交密码
			submit(){
				
			},
			
			// 输入支付密码
			clickNum(index){
				if(index < 11){
					if(index < 10){
						index += 1
						if(index === 10){
							index -= 10
						}
						if(this.number.length < 6){
							this.number += index;
							this.chat += '.'
							return
						}
					}
				}else if(index == 11){
					if(this.number.length == 0){
						uni.showToast({
							title:'请输入支付密码',
							icon:'none',
							duration:3000
						})
					}else{
						var price = this.myData.price * this.myData.qty
						console.log(price,this.myData.orderNo)
						
						this.number.toString()
						console.log(typeof(this.number),this.number)
						uni.request({
							url:'https://www.nssnail.com/wx/userPay',
							method:'POST',
							data:{
								payPwd:this.number,
								price:price,
								sessionId:this.sessionId,
								orderNo:this.myData.orderNo
							},
							success: (res) => {
								if(res.data.stat == 1){
									uni.showToast({
										title:res.data.message,
										icon:'success',
										success:()=>{
											let that = this
											setTimeout(function(){
												that.init()
											},2000);
										}
									})
									this.$refs.popup.close()
									this.init()
								}else if(res.data.stat == 0){
									uni.showToast({
										title:res.data.message,
										icon:'none'
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
		}
	}
</script>

<style scoped>
.allContent{
	width: 92%;
	margin: 0 auto;
	border-radius: 10rpx;
	background-color: white;
	height: 1100rpx;
}
.left{
	text-align: center;
}
.desc{
	height: 200rpx;
	margin-top: 10rpx;
	padding-top: 10rpx;
	border-top: 1rpx solid #BBBBBB;
	border-bottom: 1rpx solid #BBBBBB
}
.right{
	width: 92%;
	margin: 30rpx auto;
}
.price{
	color: red;
	font-size: 35rpx;
	font-weight: 600;
}
.type,.qty{
	font-weight: 600;
	margin-top: 10rpx;
}
.two{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	margin-top: 20rpx;
}
.my{
	width: 100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	margin: 15rpx 0;
	padding: 15rpx 0;
}
.mytitle{
	font-size: 30rpx;
	color: #BBBBBB;
}
.myspan{
	color: #000000;
	font-size: 25rpx;
}
.mystat{
	color: red;
	font-weight: 600;
}
.all{
	width: 100%;
	height: 500rpx;
	background-color: white;
}
.btn{
	background-color: red;
	font-size: 28rpx;
	width: 180rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
}
.keyword{
	width: 100%;
	height: 340rpx;
	display: flex;
	flex-wrap: wrap;
	flex: 1;
	bottom: 0;
	box-shadow: 3rpx 3rpx 3rpx 3rpx #EDEDED;
	position: fixed;
	right: 0;
	background-color: white;
}
.keyNumber{
	width: 33%;
	height: 80rpx;
	border-right: 1rpx solid #EDEDED;
	border-bottom: 1rpx solid #EDEDED;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: white;
}
.keyNumberBg{
	background-color: #ffd33f;
	color: #FFFFFF;
}
.password-input{
	width: 90%;
	height: 90rpx;
	margin: 50rpx auto;
	border-radius: 25rpx;
	background-color: white;
}
.input-number{
	width: 607rpx;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	flex: 1;
	background-color: white;
	border-top: 1rpx solid #EDEDED;
	border-bottom: 1rpx solid #EDEDED;
	margin: 0 auto;
	border-radius: 10rpx;
}
.number{
	width: 96rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1rpx solid #EDEDED;
	background-color: white;
	border-radius: 10rpx;
}
.pay{
	width: 750rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 30rpx;
	color: white;
	text-align: center;
	background-color: #ffd33f;
}
</style>
