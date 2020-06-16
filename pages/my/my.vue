<template>
	<view>
		<view class="unlogin">
			<view class="header">
				<image :src="myData.avatarUrl" mode="widthFix" lazy-load></image>
				<view class="myphone">{{myData.nickName}}</view>
				<view class="mygender">{{myData.gender}}</view>
			</view>
			<view class="six">
				<view class="one"><text class="mytext">我的记录</text></view>
				<view class="containerBox-icon">
					<view class="icon iconfont icon-paimai3" @tap='gotoBuy'></view>
					<view class="icon iconfont icon-huodong" @tap='activity'></view>
					<view class="icon iconfont icon-order" @tap='record'></view>
					<view class="icon iconfont icon-buoumaotubiao40" @tap='buyCar'></view>
					<view class="icon iconfont icon-aixinjuanzeng1" @tap='donation'></view>
				</view>
				<view class="containerBox">
					<view class="myrecord" @tap='gotoBuy'>竞拍</view>
					<view @tap='activity'>活动</view>
					<view style="transform: translateX(10rpx);" @tap='record'>订单</view>
					<view style="transform: translateX(10rpx);" @tap='buyCar'>购物车</view>
					<view @tap='donation'>捐赠</view>
				</view>	
			</view>

			<view class="mylist">
				<view class="one"><text class="mytext">我的资料</text></view>
				<uni-list>
					<uni-list-item title="身份认证" @tap="gotoIdentify"></uni-list-item>
					<uni-list-item title="认证资料" @tap="gotoPersonDetail"></uni-list-item>
					<uni-list-item title="修改个人资料" @tap="person"></uni-list-item>
				</uni-list>
				<view class="none"></view>
			</view>

		</view>
	</view>
</template>

<script>
import uniBadge from "@/components/uni-badge/uni-badge.vue"
import uniList from "@/components/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import {mapState,mapMutations} from 'vuex'
export default{
	data(){
		return{
			showView:true,
			myData:{
				nickName:'',
				gender:'',
				code:'',
				avatarUrl:''
			},
			sessionId:''
		}
	},
	
	onLoad() {
		this.init()
	},
	computed: mapState(['hasLogin','uerInfo']),  
	methods:{
		...mapMutations(['login']),
		
		// 登录信息渲染
		init(){
			uni.getStorage({
				key: 'userInfo',
				success:(res) => {
					this.login(res.data);
					this.myData.avatarUrl = res.data.avatarUrl
					this.myData.nickName = res.data.nickName
					this.sessionId = res.data.sessionId
					if(res.data.gender == 2){
						this.myData.gender = '女'
					}else{
						this.myData.gender = '男'
					}
				} 
			})
		},
		
		// 提示先登录
		stopSwitch(){
			uni.showToast({
				title:'请先登录',
				icon:'none'
			})
		},
		
		// 跳转至登录页面
		gotoLogin(){
			uni.navigateTo({
				url:'../login/login'
			})
		},
		
		// 跳转至身份验证页面
		gotoIdentify(){
			uni.navigateTo({
				url:'../checkIdentify/checkIdentify?sessionId='+this.sessionId
			})
		},
		
		// 跳转至资料认证页面
		gotoPersonDetail(){
			uni.navigateTo({
				url:'../personDetail/personDetail?sessionId='+this.sessionId
			})
		},
		
		// 修改个人信息
		person(){
			uni.navigateTo({
				url:'../information/information?sessionId='+this.sessionId
			})
		},
		
		// 跳转至竞拍页面
		gotoBuy(){
			uni.navigateTo({
				url:'../record/buy?sessionId='+this.sessionId
			})
		},
		
		// 跳转至订单页面
		record(){
			uni.navigateTo({
				url:'../record/record?sessionId='+this.sessionId
			})
		},
		
		// 跳转至活动页面
		activity(){
			uni.navigateTo({
				url:'../record/activity?sessionId='+this.sessionId
			})
		},
		
		// 跳转至购物车页面
		buyCar(){
			uni.navigateTo({
				url:'../record/buyCar?sessionId='+this.sessionId
			})
		},
		
		// 跳转至募捐页面
		donation(){
			uni.navigateTo({
				url:'../record/myDonation?sessionId='+this.sessionId
			})
		}
	},
	components:{
		uniBadge,
		uniList,
		uniListItem,
		uniPopup
	}
}
</script>

<style scoped>
.header{
	width: 92%;
	background-color: #ffd33f;
	margin: 30rpx auto;
	border-radius: 10rpx;
}
.header image{
	width: 150rpx;
	height: 150rpx;
	margin: 35rpx;
	border-radius: 50%;
	border: 10rpx #FFB400 solid;
	position: relative;
}
.myphone{
	position: absolute;
	top: 80rpx;
	left: 300rpx;
	font-size: 35rpx;
}
.mygender{
	position: absolute;
	top: 150rpx;
	left: 300rpx;
	font-size: 35rpx;
}
.containerBox{
	display: flex;
	width: 100%;
	margin-bottom: 20rpx;
	justify-content: space-around;
}
.containerBox-icon{
	display: flex;
	width: 100%;
	margin-top: 20rpx;
	text-align: center;
	font-size: 40rpx;
	justify-content: space-around;
}
.containerBox-badge{
	display: flex;
	width: 100%;
	margin-top: 20rpx;
	justify-content: space-around;	
}
.icon-shanchu{
	position: absolute;
	right: 0;
	top: -10;
	color: red;
}
.twocon{
	 display: flex; 
	 flex-wrap: nowrap;
	 margin-top: 20rpx;
}
.mylist{
	width: 92%;
	margin: 30rpx auto;
	background-color: white;
	border-radius: 10rpx;
}
.six{
	width: 92%;
	margin: 30rpx auto;
	border-radius: 10rpx;
	padding-bottom: 10rpx;
	background-color: white;
}
.icon{
	font-size: 60rpx;
}
.icon-paimai3,.icon-huodong{
	font-size: 55rpx;
	transform: translateY(10rpx);
}
.none{
	width: 100%;
	height: 5rpx;
}
.one{
	font-size: 30rpx;
	font-weight: 600;
	border-bottom: 2rpx solid #EEEEEE;
}
.mytext{
	margin: 30rpx;
}
</style>
