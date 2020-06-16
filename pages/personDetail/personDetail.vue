<template>
	<view>
		<view class="content">
			<!-- 头部 -->
			<view class="navbar">
				<block v-for="(item, index) in navList" :key="index">
					<view class="tabdiv" :class="{'active':tabCurrentIndex === index }" @tap="tabClick(index)">
						{{item.text}}
					</view>
				</block>
			</view>
			<!-- 显示区域 -->
			<view class="list" v-for="(item, index) in navList" :key="index" v-if="tabCurrentIndex === index">
				<!-- 这是资料页面 -->
				<template v-if="index == 0">
					<view class="myTop">
						<view class="fist"><span class="mySpan">基本信息</span></view>
						<view class="two">
							<view class="mytitle">用户昵称</view>
							<view class="myInfo">{{userInfo.user}}</view>
						</view>
						<view class="two">
							<view class="mytitle">昵称</view>
							<view class="myInfo">{{userInfo.name}}</view>
						</view>
						<view class="two">
							<view class="mytitle">性别</view>
							<view class="myInfo">{{userInfo.sex == 1 ? '男':'女'}}</view>
						</view>
						<view class="two">
							<view class="mytitle">手机</view>
							<view class="myInfo">{{userInfo.phone}}</view>
						</view>
						<view class="two" v-if="userInfo.email != null">
							<view class="mytitle">邮件</view>
							<view class="myInfo">{{userInfo.email}}</view>
						</view>
						<view class="two">
							<view class="mytitle">用户账号状态</view>
							<view class="myInfo">{{userInfo.valid == 1 ? '可用':'禁用'}}</view>
						</view>
					</view>
					
					<view class="myTop">
						<view class="fist"><span class="mySpan">机构信息</span></view>
						<view class="edit" @tap='editOrgan'>编辑</view>
						<view class="two">
							<view class="mytitle">机构名称</view>
							<view class="myInfo">{{userInfo.redCross.mname}}</view>
						</view>
						<view class="two">
							<view class="mytitle">机构昵称</view>
							<view class="myInfo">{{userInfo.redCross.name}}</view>
						</view>
						<view class="two">
							<view class="mytitle">地址</view>
							<view class="myInfo">{{userInfo.redCross.addr}}</view>
						</view>
						<view class="two" v-if="userInfo.created != null">
							<view class="mytitle">创建时间</view>
							<view class="myInfo">{{userInfo.created}}</view>
						</view>
						<view class="two" v-if="userInfo.redCross.stat != null">
							<view class="mytitle">机构状态</view>
							<view class="myInfo">{{userInfo.redCross.stat}}</view>
						</view>
					</view>
				</template>
				
				<!-- 这是奖惩信息页面 -->
				<template v-if="index == 1">
					<view class="myTop">
						<view class="fist"><span class="mySpan">信誉信息</span></view>
						<view class="two">
							<view class="mytitle">积分</view>
							<view class="myInfo">{{userInfo.integral}}</view>
						</view>
						<view class="two">
							<view class="mytitle">信誉度</view>
							<view class="myInfo">{{userInfo.credit}}</view>
						</view>
						<view class="two">
							<view class="mytitle">信誉度等级</view>
							<view class="myInfo">{{userInfo.grade}}</view>
						</view>
					</view>
					
					<view class="myTop">
						<view class="fist"><span class="mySpan">奖惩情况</span></view>
						<view class="others">
							<uni-list>
								<uni-list-item title="奖励情况" @tap="gotoReward"></uni-list-item>
								<uni-list-item title="惩罚情况" @tap="gotoPunish"></uni-list-item>
							</uni-list>
						</view>
					</view>
				</template>
			</view>
		</view>
		
	</view>
</template>

<script>
import uniBadge from "@/components/uni-badge/uni-badge.vue"
import uniList from "@/components/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
import uniPopup from '@/components/uni-popup/uni-popup.vue'	
export default{
	data(){
		return{
			tabCurrentIndex: 0,
			navList: [
				{
					state: 0,
					text: '个人资料',
					orderList: []
				},
				{
					state: 1,
					text: '信誉资料',
					orderList: []
				}
			],
			userInfo:{},
			sessionId:''
			
		}
	},
	onLoad(option) {
		this.tabCurrentIndex = 0;
		this.sessionId = option.sessionId
		this.init()
	},
	methods:{
		// 页面渲染
		init(){
			uni.request({
				url:'https://www.nssnail.com/wx/getUserInfo',
				data:{
					sessionId:this.sessionId
				},
				success: (res) => {
					if(res.data.stat == 1){
						this.userInfo = res.data.data
						console.log(this.userInfo)
					}else if(res.data.stat == 3 ||res.data.stat == 4){
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
		
		//顶部tab点击
		tabClick(index) {
			this.tabCurrentIndex = index;
		},
		
		// 跳转至奖励页面
		gotoReward(){
			uni.navigateTo({
				url:'../credit/reward'
			})
		},
		
		// 点击跳转至惩罚页面
		gotoPunish(){
			uni.navigateTo({
				url:'../credit/punish'
			})
		},
		
		// 跳转至编辑红十字会页面
		editOrgan(){
			uni.navigateTo({
				url:'../updateOrganize/updateOrganize?sessionId='+this.sessionId
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
.navbar{
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
}
.tabdiv{
	display: inline-block;
	width: 50%;
	text-align: center;
	color: #969696;
	font-weight: bolder;
	font-size: 32rpx;
	border-bottom: #FFFFFF solid 2rpx;
	padding: 20rpx 0;
}
.active{
	border-bottom: #ffd33f solid 6rpx;
	margin: auto;
}
.list{
	width: 97%;
	margin: 20rpx auto;
	border-radius: 10rpx;
}
.myTop{
	width: 95%;
	margin: 20rpx auto;
	background-color: white;
	position: relative;
	border-radius: 10rpx;
	padding: 10rpx 0;
}
.fist{
	width: 100%;
	font-size: 30rpx;
	font-weight: 600;
	position: relative;
	border-bottom: 1rpx solid #F1F1F1;
	padding: 10rpx 0;
}
.two{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	border-bottom: 2rpx solid #F1F1F1;
	margin: 15rpx auto;
	padding: 15rpx 0;
}
.mytitle{
	font-size: 30rpx;
}
.myInfo{
	margin-right: 20rpx;
	font-size: 30rpx;
	color: #969696;
}
.edit{
	width: 100rpx;
	position: absolute;
	top: 5rpx;
	left: 600rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #007AFF;
}
.mySpan{
	margin-left: 30rpx;
}
</style>

