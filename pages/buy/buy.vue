<template>
	<view>
		<view class="all" v-for="(item,index) in myData" :key="index" @tap="gotoBuyDetail(item)">
			<image :src="'http://image.nssnail.com/'+item.fileList[1].relativePath"></image>
			<view class="title">竞拍物品：{{item.name}}</view>
			<view class="created">开始时间{{item.startTime}}</view>
			<view class="stat">{{item.stat}}</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				sessionId:'',
				myData:[]
			}
		},
		computed: mapState(['hasLogin','uerInfo']), 
		onLoad() {
			this.init()
		},
		methods:{
			...mapMutations(['login']),
			
			// 页面渲染
			init(){
				uni.getStorage({
					key:'userInfo',
					success:(res)=>{
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/getAuction',
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
			
			// 跳转至详情页
			gotoBuyDetail(item){
				console.log(item)
				var id = item.id
				uni.navigateTo({
					url:'../buyDetail/buyDetail?id='+id+'&sessionId='+this.sessionId
				})
			}
		}
	}
</script>

<style scoped>
.content {
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
}
.all{
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
	position: relative;
	padding-bottom: 10rpx;
}
.all image{
	width: 690rpx;
	height: 400rpx;
	border-radius: 10rpx;
}
.title{
	font-size: 30rpx;
	font-weight: 600;
	margin: 0 0 0 10rpx;
	padding-top: 10rpx;
}
.mname{
	width: 100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	margin: 10rpx 10rpx;
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
}
.stat{
	position: absolute;
	top: 20rpx;
	left: 20rpx;
	color: white;
	background-color: red;
	padding: 5rpx 20rpx;
	border-radius: 20rpx;
}
.created{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
}	
</style>
