<template>
	<view>
		<view class="allContent">
			<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDeatil(item)">
				<view class="name">
					<uni-icons type="shop" color="orange" size="15"></uni-icons>
					<span style="margin: 5rpx 10rpx;">{{item.goods.name}}</span>
					<view class="arrow">
						<uni-icons type="arrowright" color="#BBBBBB" size="15"></uni-icons>
					</view>
				</view>
				<view class="price">￥ {{item.price}}<span class="myspan">.00</span></view>
				<view class="prices">X {{item.qty}}</view>
				<view class="left">
					<view>
						<image :src="'http://image.nssnail.com/'+item.fileList[0].relativePath"></image>
					</view>
				</view>
				<view class="right">
					<view>{{item.created}}</view>
					<view class="stat">{{item.stat}}</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				sessionId:'',
				myData:[]
			}
		},
		onLoad() {
			this.init()
		},
		computed: mapState(['hasLogin','uerInfo']), 
		methods: {
			...mapMutations(['login']),
			// 页面初始化
			init(){
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/personal/getOrderRecord',
							data:{
								sessionId:this.sessionId
							},
							success: (res) => {
								if(res.data.stat == 1){
									this.myData = res.data.data
									this.myData.forEach((item)=>{
										if(item.stat == 1){
											item.stat = '未付款'
										}else if(item.stat == 2){
											item.stat = '已付款(未发货)'
										}else if(item.stat == 3){
											item.stat = '失效'
										}else if(item.stat == 4){
											item.stat = '已发货'
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
				})
			},
			
			// 跳转至详情页面
			gotoDeatil(item){
				var id = item.id
				uni.navigateTo({
					url:'../recordDetail/recordDetail?id='+id+'&sessionId='+this.sessionId
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
}
.total{
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0 10rpx 0;
	margin-top: 20rpx;
	background-color: white;
	border-radius: 10rpx;
	position: relative;
	margin-bottom: 20rpx;
}
.left{
	margin: 20rpx;
	display: flex;
	flex-wrap: nowrap;
	position: relative;
}
.left image{
	width: 450rpx;
	height: 300rpx;
	border-radius: 15rpx;
}
.right{
	width: 100%;
	margin-left: 10rpx;
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
.arrow{
	position: absolute;
	right: 40rpx;
	top: 20rpx;
}
</style>
