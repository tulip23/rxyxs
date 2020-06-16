<template>
	<view>
		<view class="three">
			<view class="all">
				<view class="left">支付密码</view>
				<input v-model="mydata.password" placeholder="请输入6位数字" type="password" />
			</view>
			<view class="all">
				<view class="left">确认密码</view>
				<input v-model="mydata.surepassword" placeholder="请输入确认密码" type="password"/>
			</view>
			<button class="btn" @tap='sure'>确认</button>
		</view>
	</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default{
	data(){
		return{
			mydata:{
				password:'',
				surepassword:'',
			},
			check:''

		}
	},
	computed: mapState(['hasLogin','uerInfo']), 
	 onLoad(option) {
	 	this.check = option.check
	 },
	methods:{
		...mapMutations(['login']),
		sure(){
			var reg = /^\d{6}$/
			if(this.mydata.password != this.mydata.surepassword){
				uni.showToast({
					title:'密码不一致',
					icon:'none'
				})
			}else if(!reg.test(this.mydata.password) || !reg.test(this.mydata.surepassword)){
				uni.showToast({
					title:'请输入6位数的密码',
					icon:'none'
				})
			}else{
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/personal/setUserPayPwd',
							method:'POST',
							data:{
								sessionId:this.sessionId,
								payPwd:this.mydata.password
							},
							success:(res)=>{
								if(res.data.stat == 1){
									uni.showToast({
										title:'设置成功',
										icon:'success',
										success: () => {
											uni.navigateTo({
												url:'../information/information'
											})
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
	margin-right: 100rpx;
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
