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
				<!-- 这是人数未满页面 -->
				<template v-if="index == 0">
					<view class="activitycss">
						<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDetail(item)" v-if="item.stat == '1'">
							<view class="first">
								<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
							</view>
							<view class="second">
								<view class="contents">{{item.name}}</view>
								<view class="createdTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 这是人数已满页面 -->
				<template v-if="index == 1">
					<view class="activitycss">
						<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDetail(item)" v-if="item.stat == '2'">
							<view class="first">
								<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
							</view>
							<view class="second">
								<view class="contents">{{item.name}}</view>
								<view class="createdTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 这是已完成页面 -->
				<template v-if="index == 2">
					<view class="activitycss">
						<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDetail(item)" v-if="item.stat == '3'">
							<view class="first">
								<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
							</view>
							<view class="second">
								<view class="contents">{{item.name}}</view>
								<view class="createdTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 这是已取消页面 -->
				<template v-if="index == 3">
					<view class="activitycss">
						<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoDetail(item)" v-if="item.stat == '4'">
							<view class="first">
								<image :src="'http://image.nssnail.com/'+item.file.relativePath"></image>
							</view>
							<view class="second">
								<view class="contents">{{item.name}}</view>
								<view class="createdTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			myData:[],
			sessionId:'',
			tabCurrentIndex: 0,
			navList: [
				{
					state: 0,
					text: '人数未满',
					orderList: []
				},
				{
					state: 1,
					text: '人数已满',
					orderList: []
				},
				{
					state: 2,
					text: '已完成',
					orderList: []
				},
				{
					state: 3,
					text: '已取消',
					orderList: []
				}
			],
		}
	},
	onLoad(option) {
		this.tabCurrentIndex = 0;
		this.sessionId = option.sessionId
		this.init()
	},
	methods:{
		init(){
			uni.request({
				url:'https://www.nssnail.com/wx/getActivities',
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
		
		//顶部tab点击
		tabClick(index) {
			this.tabCurrentIndex = index;
		},
		
		// 跳转至详情页
		gotoDetail(item){
			var id = item.id
			uni.navigateTo({
				url:'../activityDetail/activityDetail?id='+id
			})
		},
	},
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
	font-size: 30rpx;
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
.fist{
	font-size: 30rpx;
	font-weight: 600;
	margin: 5rpx;
	position: relative;
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
.stat{
	position: absolute;
	right: 20rpx;
	bottom: 0;
}
.activitycss{
	width: 95%;
	background-color: white;
	margin: 20rpx auto;
	padding-bottom: 20rpx;
	border-radius: 10rpx;
}
</style>

