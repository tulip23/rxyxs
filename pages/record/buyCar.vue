<template>
	<view>
		<view class="big">
			<view class="headCss" v-if="!flag">
				购物车空空如也，请先<span class="choise" @tap="gotoChoise">选购</span>
			</view>
			<view v-else>
				<view class="cartitem" v-for="(item,index) of myData" :key="index">
					<view class="top">
						<view class="twoleft">
							<checkbox-group @change="selected(item)">
								<checkbox color="orange" style="transform:scale(0.7);" :checked="item.flag" />
							</checkbox-group>
							<span>商品：{{item.name}}</span>
						</view>
						<view class="del">
							<uni-icons class="del" color="orange" type="trash" size="18" @tap="del(item,index)"></uni-icons>
						</view>
					</view>
					
					<view class="center">
						<view class="mainContain">
							<view>
								<image :src="'http://image.nssnail.com/'+item.goods.fileList[0].relativePath"></image>
							</view>
							<view class="main">
								<view class="descript">{{item.goods.description}}
									<view class="twoBtn">
										<view style="color: red;">￥{{item.myPrice}}</view>
										<view class="buybtn">
											<uni-icons color="orange" type="minus" size="15" @tap="reduce(item)"></uni-icons>
											<span class="myqtys">{{item.qty}}</span>
											<uni-icons color="orange" type="plus" size="15" @tap="add(item)"></uni-icons>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 底部导航 -->
				<view class="three">
					<view class="choose">
						<checkbox-group @change="selectedall()">
							<checkbox :checked="allchecked" color="orange" style="transform:scale(0.7);" />全选
						</checkbox-group>
					</view>
					<view class="two">
						<view class="total">
							合计：{{totalPrice}}
						</view>
						<button @tap="submit" :disabled="disabled" class="allNumber">
							结算:（ {{totalNum}} )
						</button>
						
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
				
			</view>
		
		</view>
	</view>
</template>

<script>
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				flag: true,//用于判断用户购物车是否有商品，没有商品为true，有商品为false
				myData: [],
				allchecked: false ,
				sessionId:'',
				cartList:[],
				disabled:true,
				submitPrice:'',
				payPwd:'',
				keyNumberList:[1,2,3,4,5,6,7,8,9,0,'.','支付'],
				number:[],
				chat:[]
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			...mapState(['hasLogin','uerInfo']), 
			
			// 计算选中商品数量
			totalNum() {
				let totalNum = 0;
				this.myData.map(item => {
					item.flag ? totalNum += 1 : totalNum += 0
				})
				return totalNum
			},
			
			//计算选中商品的总价
			totalPrice() {
				let totalPrice = 0;
				this.myData.map(item => {
					item.flag ? totalPrice += item.qty * item.myPrice : totalPrice += 0
				})
				return totalPrice
			}
		},
		watch:{
			// 监听按钮禁用状态
			totalNum(val){
				if(val != 0){
					this.disabled = false
				}else{
					this.disabled = true
				}
			},
			
			// 监听总价
			totalPrice(val){
				this.submitPrice = val
			},
			
			flag(val){
				console.log(val)
			}
			
		},
		methods: {
			...mapMutations(['login']),
			// 单个商品前的勾选
			selected(item) {
				item.flag = !item.flag
				if (!item.flag) {
					this.allchecked = false
				} else {
					const test = this.myData.every(item => {
						return item.flag === true
					})
					if (test) {
						this.allchecked = true
					} else {
						this.allchecked = false
					}
				}
				
			},
			// 全选按钮
			selectedall() {
				this.allchecked = !this.allchecked
				if (this.allchecked) {
					this.myData.map(item => {
						item.flag = true
					})
				} else {
					this.myData.map(item => {
						item.flag = false
					})
				}
			},
			
			// 结算
			submit(){
				this.$refs.popup.open()
				this.number = []
				this.chat = []
			},
			
			// 调用接口
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
						this.myData.forEach(e=>{
							if(e.flag){
								var data={
									id:e.id,
									goodId:e.goods.id,
									userId:e.userId,
									qty:e.qty,
									price:e.price,
									name:e.name
								}
								this.cartList.push(data)
							}
						})
						uni.request({
							url:'https://www.nssnail.com/wx/cartSettlement',
							method:'POST',
							data:{
								cartList:this.cartList,
								sessionId:this.sessionId,
								totalPrice:this.submitPrice,
								payPwd:this.number
							},
							success: (res) => {
								if(res.data.stat == 1){
									uni.showToast({
										title:res.data.message,
										icon:'success',
										duration:3000
									})
									this.$refs.popup.close()
									this.init()
								}else if(res.data.stat == 0){
									uni.showToast({
										title:res.data.message,
										icon:'none',
										duration:3000
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
			},
			
			// 页面初始化
			init(){
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/getCart',
							data:{
								sessionId:this.sessionId
							},
							success: (res) => {
								if(res.data.stat == 1){
									res.data.data.map(item =>{
										item.flag = false
									})
									this.myData = res.data.data
									// this.cartList = res.data.data
									if(this.myData.length == 0){
										this.flag = false
									}
									// 遍历myData，给条数据新增一个字段myPrice，代表每个商品的价格
									for(var i in res.data.data){
										var myPrice = this.myData[i].price/this.myData[i].qty
										this.myData[i].myPrice = myPrice
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
					} 
				})

			},
			
			// 减号操作
			reduce(item) {
				var id = item.id
				var goodsPrice = item.myPrice
				if (item.qty > 1) {
					var myqty = --item.qty
					this.updateQty(myqty,goodsPrice,id)
				} else {
					item.qty = 1
					var myqty = 1
					this.updateQty(myqty,goodsPrice,id)
					return
				}
			},
			
			// 加号操作
			add(item) {
				var id = item.id
				var goodsPrice = item.myPrice
				var myqty = ++item.qty
				this.updateQty(myqty,goodsPrice,id)
			},
			
			// 修改商品数量
			updateQty(myqty,goodsPrice,id){
				var price = myqty * goodsPrice
				uni.request({
					url:'https://www.nssnail.com/wx/updateCart',
					method:'POST',
					data:{
						id:id,
						qty:myqty,
						price:price,
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							return this.myData
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
			
			// 删除单挑购物车商品
			del(item, index) {
				var id = item.id
				console.log(id)
				uni.showModal({
				    title: '提示',
				    content: '是否删除购物车？',
				    success: (res) => {
				        if (res.confirm) {
				            uni.request({
				            	url:'https://www.nssnail.com/wx/deleteCart',
								method:'POST',
				            	data:{
				            		id:id,
				            		sessionId:this.sessionId
				            	},
				            	success: (res) => {
				            		if(res.data.stat == 1){
				            			uni.showToast({
				            				title:'删除成功',
				            				icon:'success',
				            				duration:2000,
				            				success: () => {
				            					this.init()
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
									}else if(res.data.stat == 0){
										uni.showToast({
											title:res.data.message,
											icon:'none',
											duration:3000
										})
									}
				            	}
				            })
				        }
				    }
				});
			},
			
			// 跳转至物品页面
			gotoChoise(){
				uni.navigateTo({
					url:'../allGoods/allGoods'
				})
			}

		},
		components:{
			uniGoodsNav
		}
	}
</script>

<style scoped>
.cartitem {
	width: 92%;
	background-color: white;
	margin: 20rpx auto;
	border-radius: 10rpx;
	padding-bottom: 10rpx;
}
.itemright {
	display: inline-block;
	padding: 5px;
}
.del {
	transform: translateX(30rpx);
}
.headCss{
	width: 92%;
	background-color: white;
	height: 200rpx;
	line-height: 200rpx;
	text-align: center;
	font-weight: 600;
	margin: 20rpx auto;
	border-radius: 10rpx;
	font-size: 30rpx
}
.choise{
	color: orange;
	margin: 0 20rpx;
}
.three{
	display: flex;
	flex-wrap: nowrap;
	width: 100%;
	background-color: white;
	position: fixed;
	z-index: 1;
	height: 100rpx;
	line-height: 100rpx;
	bottom: 0;
	justify-content: space-between;
	font-size: 30rpx;
}
.two{
	display: flex;
	flex-wrap: nowrap;
	font-size: 30rpx;
	margin-top: 10rpx;
	margin-right: 20rpx;
}
.choose{
	margin-top: 10rpx;
	margin-left: 20rpx;
	line-height: 80rpx;
	text-align: center;
	height: 80rpx;
	width: 200rpx;
}
.top{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.twoleft{
	display: flex;
	flex-wrap: nowrap;
	margin: 17rpx;
}
.twoleft span{
	display: inline-block;
	width: 400rpx;
	transform: translateX(-180rpx);
	margin-top: 5rpx;
}
.center{
	width: 100%;
	margin-top: 10rpx;
}
.center image{
	width: 200rpx;
	height: 200rpx;
	margin-left: 25rpx;
}
.mainContain{
	display: flex;
	flex-wrap: nowrap;
}
.main{
	margin-left: 20rpx;
}
.descript{
	height: 200rpx;
	width: 420rpx;
	margin-left: 20rpx;
	position: relative;
}
.twoBtn{
	width: 100%;
	position: absolute;
	bottom: 10rpx;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.buybtn{
	margin-right: 20rpx;
	transform: translateY(-6rpx);
}
.myqtys{
	margin: 0 30rpx;
	display: inline-block;
	transform: translateY(-2rpx);
	font-size: 30rpx;
}
.onePrice{
	width: 400rpx;
	margin-left: 25rpx;
	color: red;
}
.big{
	padding-bottom: 100rpx;
}
button::after{ 
	border: none;
}
.total,.allNumber{
	width: 300rpx;
	background-color: orange;
	color: white;
	line-height: 80rpx;
	text-align: center;
	border-radius: 40rpx;
	height: 80rpx;
}
.total{
	background-color: white;
	margin-right: 20rpx;
	color: black;
	width: 200rpx;
}
.allNumber{
	font-size: 30rpx;
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

