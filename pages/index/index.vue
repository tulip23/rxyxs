<template>
	<view>
		<image src="../../static/logos.jpg" mode="widthFix"></image>
		<view class="content">
			<view class="service">服务</view>
			<view class="gridcss">
				<uni-grid :column="3">
				    <uni-grid-item @tap="gotoNotice">
						<view class="icon iconfont icon-megaphone__ea"></view>
				        <text class="text">募捐公告</text>
				    </uni-grid-item>
				    <uni-grid-item @tap="gotoDonate">
						<view class="icon iconfont icon-huodong"></view>
				        <text class="text">全部活动</text>
				    </uni-grid-item>
				    <uni-grid-item @tap='gotoBuy'>
						<view class="icon iconfont icon-shangpingoumai"></view>
				        <text class="text">购买物品</text>
				    </uni-grid-item>
				</uni-grid>
			</view>
		</view>
		
		<!-- 活动列表 -->
		<view class="activitycss">
			<view class="service" id="myac">活动列表</view>
			<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDetail(item)" v-if="item.stat == '人数未满'">
				<view class="first">
					<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
				</view>
				<view class="second">
					<view class="contents">{{item.name}}</view>
					<view class="createdTime">
						{{item.createTime}}
						<view class="stat">{{item.stat}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
import {mapState,mapMutations} from 'vuex'
export default {
	data() {
		return {
			title: 'Hello',
			myCode:'',
			sessionId:'',
			myData:[],
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
				key:'userInfo',
				success:(res)=>{
					this.login(res.data);
					this.sessionId = res.data.sessionId
					uni.request({
						url:'https://www.nssnail.com/wx/getActivities',
						withCredentials:true,
						data:{
							sessionId:this.sessionId
						},
						success: (res) => {
							if(res.data.stat == 1){
								this.myData = res.data.data
								this.myData.forEach((item)=>{
									if(item.stat == 1){
										item.stat = '人数未满'
									}else if(item.stat == 2){
										item.stat = '人数已满'
									}else if(item.stat == 3){
										item.stat = '已完成'
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
		gotoDetail(item){
			var id = item.id
			uni.navigateTo({
				url:'../activityDetail/activityDetail?id='+id+'&sessionId='+this.sessionId
			})
		},
		
		// 跳转至购买页面
		gotoBuy(){
			uni.navigateTo({
				url:'../allGoods/allGoods?sessionId='+this.sessionId
			})
		},
		
		// 跳转至募捐公告页面
		gotoNotice(){
			uni.navigateTo({
				url:'../donateNotice/donateNotice?sessionId='+this.sessionId
			})
		},
		
		// 跳转至活动页面
		gotoDonate(){
			uni.navigateTo({
				url:'../activity/activity?sessionId='+this.sessionId
			})
		}
	},
	components: {
		uniGrid,
		uniGridItem
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
.gridcss{
	width: 90%;
	margin: 0 auto;
	padding: 20rpx 0;
	text-align: center;
}
.icon-megaphone__ea{
	color: orange;
}
.icon-huodong{
	color: red;
}
.icon-shangpingoumai{
	color: #E80080;
}
.icon{
	margin-top: 15rpx;
	font-size: 60rpx;
}
.service{
	width: 91.5%;
	font-size: 30rpx;
	font-weight: 600;
	margin-left: 35rpx;
}
.activitycss{
	width: 92%;
	background-color: white;
	margin: 20rpx auto;
	padding-bottom: 20rpx;
	border-radius: 10rpx;
}
.first image{
	width: 250rpx;
	height: 180rpx;
	border-radius: 10rpx;
}
.first{
	margin: 0;
	padding: 0;
}
.total{
	display: flex;
	flex-wrap: nowrap;
	width: 92%;
	margin: 0 auto;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #EEEEEE;
	margin-top: 10rpx;
}
.second{
	margin-left: 30rpx;
	position: relative;
}
.contents{
	width: 100%;
	margin: 0;
	padding: 0;
	height: 140rpx;
}
.createdTime{
	color: #BBBBBB;
	font-size: 25rpx;
	margin: 0;
	padding: 0;
	position: relative;
}
#myac{
	border-bottom: 2rpx solid #EEEEEE;
	padding-bottom: 20rpx;
}
.stat{
	position: absolute;
	left: 0rpx;
	bottom: 50rpx;
	color: red;
}
</style>
