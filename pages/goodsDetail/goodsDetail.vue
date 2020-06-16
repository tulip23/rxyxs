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
					<view class="desc">{{myData.description}}</view>
					<view class="two">
						<view class="type">{{myData.type}}</view>
						<view class="qty">数量 {{myData.qty}}</view>
						<view class="price">￥ {{myData.price}}<span class="myspan">.00</span></view>
					</view>
					
					<view class="my">
						<view class="mytitle">商品创建时间：{{myData.created}}</view>
					</view>
					
					<view class="mynav">
						<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
					</view>
				</view>
				
				
				<!-- 弹窗 -->
				<uni-popup ref="popup" type="bottom">
					<view class="all">
						<view class="pop">
							<image :src="url"></image>
						</view>
						<view class="myGoods">
							<view class="myname">{{myData.name}}</view>
							<view class="myprice">￥<span class="myspans">{{myData.price}}</span></view>			
							<view class="myname">库存：{{myData.qty}}</view>
						</view>
						
						<view class="mytwo">
							<view class="buy">购买数量</view>
							<view class="buybtn">
								<uni-icons type="minus" size="20" @tap="reduce"></uni-icons>
								<span class="myqtys">{{buyQty}}</span>
								<uni-icons type="plus" size="20" @tap="add"></uni-icons>
							</view>
						</view>
						<view class="close" @tap="closePop">
							<uni-icons type="close" size="20"></uni-icons>
						</view>
						<button class="btn" @tap='sure'>确认</button>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
import uniIcons from "@/components/uni-icons/uni-icons.vue"
export default {
	data() {
		return {
			id:'',
			sessionId:'',
			myData:{},
			options:[{
				icon: 'cart',
				text: '购物车',
				info: 0
			}],
			buttonGroup: [{
				text: '加入购物车',
				backgroundColor: '#ff0000',
				color: '#fff'
			},
			{
				text: '立即购买',
				backgroundColor: '#ffa200',
				color: '#fff'
			}],
			buyQty:1,
			url:'',
			flag:''
		}
	},
	onLoad(option) {
		this.id = option.id
		this.sessionId = option.sessionId
		this.url = option.url
		this.init()
	},
	methods: {
		// 页面渲染
		init(){
			uni.request({
				url:'https://www.nssnail.com/wx/getGoodsById',
				data:{
					sessionId:this.sessionId,
					id:this.id
				},
				success: (res) => {
					if(res.data.stat == 1){
						this.myData = res.data.data
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
		
		// 点击跳转至购物车
		onClick(e){
			uni.navigateTo({
				url:'../record/buyCar'
			})
		},
		
		// 
		buttonClick(e){
			if(e.index == 0){
				this.$refs.popup.open()
				this.flag = 1
				this.buyQty = 1
			}else{
				this.flag = 2
				this.$refs.popup.open()
				this.buyQty = 1
			}
			
		},
		
		// 关闭弹窗
		closePop(){
			this.$refs.popup.close()
		},
		
		// 数量
		reduce(){
			if(this.buyQty > 1){
				this.buyQty --
			}else{
				uni.showToast({
					title:'数量低于范围~',
					icon:'none'
				})
			}
		},
		
		// 增加
		add(){
			if(this.buyQty < this.myData.qty){
				this.buyQty ++
			}else{
				uni.showToast({
					title:'库存不够了~',
					icon:'none'
				})
				return
			}
		},
		
		// 加入购物车
		sure(){
			//当flag为1时调用加入购物车接口
			if(this.flag == 1){
				this.addCart()
			}else{
				this.buyNow()
			}
		},
		
		// 加入购物车
		addCart(){
			var price = parseInt(this.buyQty) * parseInt(this.myData.price)
			uni.request({
				url:'https://www.nssnail.com/wx/addCart',
				method:'POST',
				data:{
					goodId:this.myData.id,
					name:this.myData.name,
					qty:this.buyQty,
					price:price,
					sessionId:this.sessionId
				},
				success: (res) => {
					console.log(res,'res')
					if(res.data.stat == 1){
						uni.showToast({
							title:'添加成功',
							icon:'success',
							duration:2000
						})
						this.$refs.popup.close()
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
						this.$refs.popup.close()
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
		},
		
		// 立即购买
		buyNow(){
			var price = parseInt(this.buyQty) * parseInt(this.myData.price)
			uni.request({
				url:'https://www.nssnail.com/wx/createOrder',
				method:'POST',
				data:{
					goodId:this.myData.id,
					qty:this.buyQty,
					price:price,
					sessionId:this.sessionId
				},
				success: (res) => {
					console.log(res,'res')
					if(res.data.stat == 1){
						uni.showToast({
							title:'添加成功',
							icon:'success',
							duration:2000,
							success:()=>{
								setTimeout(function(){
									uni.navigateTo({
										url:'../record/record'
									})
								},3000);
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
						this.$refs.popup.close()
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
	components:{
		uniGoodsNav,
		uniIcons
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
	position: relative;
}
.left{
	text-align: center;
}
.left image{
	width: 650rpx;
	height: 650rpx;
	border-radius: 15rpx;
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
.all{
	height: 550rpx;
	background-color: white;
	display: flex;
	flex-wrap: wrap;
	position: relative;
}
.pop{
	margin: 20rpx;
	padding-top: 20rpx;
}
.pop image{
	width: 200rpx;
	height: 200rpx;
	border-radius: 20rpx;
}
.mynav{
	position: absolute;
	bottom: 0;
	width: 90%;
	z-index: 10;
}
.myGoods{
	margin-top: 40rpx;
	margin-left: 50rpx;
	position: absolute;
	top: 20rpx;
	left: 300rpx;
}
.myname{
	font-weight: 600;
}
.myprice{
	margin-top: 10rpx;
	color: red;
}
.myspans{
	font-size: 35rpx;
	font-weight: 600;
	color: red;
}
.mytwo{
	width: 100%;
	border-bottom: 2rpx solid #F1F1F1;
	border-top: 2rpx solid #F1F1F1;
	margin-bottom: 10rpx;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	height: 110rpx;
}
.close{
	position: absolute;
	top: 10rpx;
	right: 20rpx;
}
.myqtys{
	margin: 0 30rpx;
	display: inline-block;
	transform: translateY(-5rpx);
	font-size: 30rpx;
}
.buy{
	margin: 35rpx 10rpx;
}
.buybtn{
	margin-top: 15rpx;
	margin-right: 20rpx;
}
.btn{
	background-color: red;
	font-size: 28rpx;
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
}
</style>
