<template>
	<view>
		<view class="three">
			<view class="all">
				<view class="left">输入邮箱</view>
				<input v-model="email" placeholder="请输入邮箱" />
			</view>
			<button class="btn" @tap='sure'>确认</button>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			email:'',
			sessionId:''
		}
	},
	onLoad(option){
		this.sessionId = option.sessionId
	},
	methods:{
		sure(){
			var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
			if(reg.test(this.email)){
				uni.request({
					url:'https://www.nssnail.com/wx/personal/updateUserEmail',
					method:'POST',
					data:{
						email:this.email,
						sessionId:this.sessionId
					},
					success: (res) => {
						if(res.data.stat == 1){
							uni.showToast({
								title:'邮箱更换成功',
								icon:'success',
								success:()=>{
									setTimeout(function(){
										uni.navigateBack({
											delta:1
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
							});
						}
					}
				})
			}else{
				uni.showToast({
					title:'邮箱格式错误',
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
	margin-right: 50rpx;
	width: 200rpx;
}
.three{
	background-color: white;
	width: 92%;
	border-radius: 10rpx;
	padding: 20rpx 0;
	margin: 20rpx auto;
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
</style>
