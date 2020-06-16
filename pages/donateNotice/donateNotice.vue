<template>
	<view>
		<view class="all" v-for="(item,index) in myData" :key="index" @tap="gotoNoticeDetail(item)">
			<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
			<view class="title">主题：{{item.title}}</view>
			<view class="created">{{item.created}}</view>
			<view class="stat">{{item.stat}}</view>
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
			init(){
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
				uni.request({
					url:'https://www.nssnail.com/wx/getFundrasingNotice',
					data:{
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							this.myData = res.data.data
							this.myData.forEach((item)=>{
								if(item.stat == 1){
									item.stat = '募捐中'
								}else{
									item.stat = '已取消'
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
					} 
				})
			},
			
			// 跳转至详情页
			gotoNoticeDetail(item){
				var id = item.id
				uni.navigateTo({
					url:'../donateNoticeDetail/donateNoticeDetail?id='+id+'&sessionId='+this.sessionId
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
	bottom: 25rpx;
	right: 20rpx;
	color: red;
}
.created{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
}
</style>
