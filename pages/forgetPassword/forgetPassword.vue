<template>
	<view>
		<view class="three">
			<view class="all">
				<view class="left">支付密码</view>
				<input v-model="password" placeholder="请输入支付密码" type="password" />
			</view>
			<view class="all">
				<view class="left">确认密码</view>
				<input v-model="surepassword" placeholder="请输入确认密码" type="password"/>
			</view>
			<button class="btn" @tap='sure'>确认</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password:'',
				surepassword:'',
				sessionId:''
			}
		},
		onLoad(option) {
			this.sessionId = option.sessionId
		},
		methods: {
			// 提交
			sure(){
				if(this.password != this.surepassword){
					uni.showToast({
						title:'密码不一致',
						icon:'none'
					})
				}else{
					uni.request({
						url:'https://www.nssnail.com/wx/personal/setUserPayPwd',
						method:'POST',
						data:{
							payPwd :this.password
						},
						success: (res) => {
							if(res.data.stat == 1){
								uni.showToast({
									title:'设置成功',
									icon:'success',
									success:()=>{
										setTimeout(function(){
											uni.navigateTo({
												url:'../information/information'
											})
										},2000);
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
								})
							}
						}
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
	margin-right: 50rpx;
	width: 200rpx;
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
