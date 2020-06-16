<template>
	<view>
		<view class="three">
			<view class="get" @tap="getCheckNum()">
				<text>{{!codeTime?'获取验证码':codeTime+'s'}}</text>
			</view>
			<view class="all">
				<view class="left">验证码</view>
				<input v-model="mydata.checkNum" placeholder="请输入验证码"/>
			</view>
			<button class="btn" @tap='sure'>确认</button>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				codeTime:0,
				mydata:{
					phone:'',
					checkNum:''
				},
				sessionId:'',
				check:'',
				flags:''
			}
		},
		computed: mapState(['hasLogin','uerInfo']),
		onLoad(option) {
			this.init()
			this.check = option.check
			this.flags = option.flags
			console.log(option)
		},
		methods: {
			...mapMutations(['login']),
			// 获取登录session
			init(){
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
					} 
				})
			},
			// 获取验证码
			getCheckNum(){
				if(this.codeTime>0){
					uni.showToast({
						title: '不能重复获取',
						icon:"none"
					});
					return;
				}else{
					this.codeTime = 60
					let timer = setInterval(()=>{
						this.codeTime--;
						if(this.codeTime<1){
							clearInterval(timer);
							this.codeTime = 0
						}
					},1000)
					// 请求服务器，发送验证码到手机发送成功，开启倒计时
					uni.request({
						url:'https://www.nssnail.com/wx/personal/getVerificationCode',
						data:{
							sessionId:this.sessionId
						},
						success: (res) => {
							if(res.data.stat == 1){
								uni.showToast({
									title:res.data.message,
									icon:'success',
									duration:2000
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
			},
				
			// 提交
			sure(){
				if(this.mydata.checkNum != ''){
					uni.request({
						url:'https://www.nssnail.com/wx/personal/judgeVerificationCode',
						data:{
							code:this.mydata.checkNum,
							sessionId:this.sessionId
						},
						success:(res)=>{
							if(res.data.stat == 1){
								uni.showToast({
									title:res.data.message,
									icon:'success',
									success:()=>{
										if(this.check == 2){
											setTimeout(function(){
												uni.navigateTo({
													url:'../personInfo/setPassword'
												})
											},2000);
										}else{
											setTimeout(function(){
												uni.navigateTo({
													url:'../updatePhone/updatePhone'
												})
											},2000);
										}
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
							}else if(res.data.stat == 0){
								uni.showToast({
									title:res.data.message,
									icon:'none'
								})
							}
						}
					})
				}else{
					uni.showToast({
						title:'请输入验证码',
						icon:'none'
					})
				}
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
	margin-right: 40rpx;
	width: 150rpx;
}
.three{
	background-color: white;
	width: 92%;
	border-radius: 10rpx;
	padding: 20rpx 0;
	margin: 20rpx auto;
	position: relative;
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
}
.get{
	position: absolute;
	top: 40rpx;
	right: 30rpx;
	background-color: orange;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	border-radius: 10rpx;
	padding: 0 20rpx;
}
</style>
