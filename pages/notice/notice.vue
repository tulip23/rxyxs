<template>
	<view>
		<view class="all" v-for="(item,index) in myData" :key="index" @tap="gotoNoticeDetail(item)">
			<view class="title">主题：{{item.title}}</view>
			<view class="created">{{item.created}}</view>
			<view class="mname">
				<view class="myInfo">机构：{{item.redCross.mname}}</view>
			</view>
			<view class="name">
				发布人：{{item.redCrossUser.name}}
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				myData:[],
				sessionId:''
			}
		},
		onLoad() {
			this.init()
		},
		computed: mapState(['hasLogin','uerInfo']), 
		methods: {
			...mapMutations(['login']),
			// 页面渲染
			init(){
				uni.getStorage({
					key:'userInfo',
					success:(res)=>{
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/getNotices',
							withCredentials:true,
							data:{
								sessionId:this.sessionId
							},
							success: (res) => {
								if(res.data.stat == 1){
									this.myData = res.data.data
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
			
			// 跳转至详情页面
			gotoNoticeDetail(item){
				var id = item.id
				uni.navigateTo({
					url:'../noticeDetail/noticeDetail?id='+id+'&sessionId='+this.sessionId
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
	height: 200rpx;
}
.title{
	font-size: 30rpx;
	font-weight: 600;
	margin: 20rpx 0 0 10rpx;
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
.name{
	margin: 10rpx 10rpx;
	color: #BBBBBB;
}
.created{
	position: absolute;
	top: 130rpx;
	right: 20rpx;
	color: #BBBBBB;
}
</style>
