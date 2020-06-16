<template>
	<view>
		<uni-popup ref="popup" type="center">
			<view class="all">
				<view class="pop">
					<image src="../../static/logo2.png" mode="widthFix"></image>
					
					<button open-type="getUserInfo" @getuserinfo='loginUser'>
						<view class="icon iconfont icon-weixin" style="font-size: 30px;"></view>
					</button>
					<view class="getRight">
						<p>微信授权登录之后</p>
						<p>才可以进行下一步操作哦</p>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'; 
export default{
	data(){
		return {
			myData:{
				nickName:'',
				gender:'',
				code:'',
				avatarUrl:'',
				sessionId:''
			},
			telephone:'',
			checkCode:'',
			codeTime:0
		}
	},
	onLoad() {
		this.$refs.popup.open()
	},
	computed:{
		...mapState(['hasLogin'])
	}, 
	methods:{
		...mapMutations(['login']),
		loginUser(){
			uni.getProvider({
			  service: 'oauth',
			  success: (res) => {
				if (~res.provider.indexOf('weixin')) {
					uni.login({
						provider: 'weixin',
						success: (res) => {
							this.myCode = res.code;
							uni.getUserInfo({
								provider: 'weixin',
								success: (info) => {//这里请求接口
									this.myData.code = res.code
									this.myData.nickName = info.userInfo.nickName
									this.myData.gender = info.userInfo.gender
									this.myData.avatarUrl = info.userInfo.avatarUrl
									console.log(this.myData)
									uni.request({
										url:'https://www.nssnail.com/wx/onLogin',
										method:'POST',
										withCredentials:true,
										data:{
											myData:this.myData,
											avatarUrl:this.myData.avatarUrl,
											code:this.myData.code,
											gender:this.myData.gender,
											nickName:this.myData.nickName
										},
										success: (res) => {
											if(res.data.stat==1){
												this.myData.sessionId = res.data.data.sessionId
												this.login(this.myData)
												if(res.data.data.isSelectedRedCross == true){
													uni.switchTab({
														url:'../my/my'
													})
												}else{
													uni.navigateTo({
														url:'../certification/certification'
													})
												}
											}else{
												uni.showToast({
													title:res.data.message
												})
											}
										}
									})
								},
								fail: () => {
									uni.showToast({title:"微信登录授权失败",icon:"none"});
								}
							})
						},
						fail: () => {
							uni.showToast({title:"微信登录授权失败",icon:"none"});
						}
					})
				}else{
					uni.showToast({
						title: '请先安装微信或升级版本',
						icon:"none"
					});
				}
			  }
			});
		},
		
		// 阻止关闭
		stopClose(){
			this.$refs.popup.open()
		}
	}
}
</script>

<style scoped>
.all{
	margin: 30rpx;
	border-bottom: 2rpx solid #EEEEEE;
	display: flex;
	flex-wrap: nowrap;
}
.left{
	margin-bottom: 30rpx;
	margin-right: 50rpx;
	width: 200rpx;
}
.checkBtn{
	
}
.pop{
	width: 550rpx;
	height: 800rpx;
	background-color: white;
	opacity:0.9;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: 300rpx auto;
	border-radius: 30rpx;
}
.pop image{
	width: 350rpx;
	height: 350rpx;
	margin-top: 40rpx;
	border-radius: 50%;
	opacity:1
}
.pop button{
	width: 220rpx;
	font-size: 24rpx;
	background-color: white;
	transform: translateY(-70rpx);
	height: 95rpx;
	line-height: 95rpx;
	opacity:1
}
.icon-weixin{
	color: #09BB07;
	opacity:1
}
button::after{ border: none;}
.getRight{
	width: 400rpx;
	margin: 0 auto;
	transform: translateY(-100rpx);
	font-weight: 600;
	text-align: center;
}
.all{
	width: 750rpx;
	height: 1400rpx;
	text-align: center;
}
</style>
