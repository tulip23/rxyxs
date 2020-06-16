<template>
	<view>
		<view class="three">
			<view class="all">
				<view class="left">输入手机号</view>
				<input v-model="phone" placeholder="请输入手机号" />
			</view>
			<button class="btn" @tap='sure'>确认</button>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			phone:''
		}
	},
	methods:{
		sure(){
			var mPattern = /^1[34578]\d{9}$/;
			if(mPattern.test(this.phone)){
				uni.showToast({
					title:'手机格式正确',
					icon:'success'
				})
				uni.request({
					//url:'https://www.nssnail.com/wx/personal/updateUserEmail',
					method:'POST',
					data:{
						email:this.email
					},
					success: (res) => {
						console.log(res,'返回的数据')
					},
					fail: (res) => {
						console.log(res,'失败了')
					}
				})
			}else{
				uni.showToast({
					title:'手机格式错误',
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
