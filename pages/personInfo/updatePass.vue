<template>
	<view>
		<view class="three">
			<view class="all">
				<view class="left">原始密码</view>
				<input v-model="mydata.originPass" placeholder="请输入原始密码" type="password" />
			</view>
			<view class="all">
				<view class="left">新密码</view>
				<input v-model="mydata.password" placeholder="请输入6位数密码" type="password"/>
			</view>
			<view class="all">
				<view class="left">确认密码</view>
				<input v-model="mydata.surepassword" placeholder="请输入确认密码" type="password"/>
			</view>
			<view class="two">
				<button class="btn" @tap='sure'>确认</button>
				<button class="btn" @tap='forgetpass'>忘记密码</button>				
			</view>

		</view>
	</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex'	
export default{
	data(){
		return{
			mydata:{
				originPass:'',
				password:'',
				surepassword:'',
			},
			sessionId:''
		}
	},
	computed: mapState(['hasLogin','uerInfo']),  
	methods:{
		...mapMutations(['login']),
		// 修改密码
		sure(){
			var reg = /^\d{6}$/
			if(this.mydata.password != this.mydata.surepassword){
				uni.showToast({
					title:'密码不一致',
					icon:'none'
				})
			}else if(!this.mydata.password || !this.mydata.surepassword || !this.mydata.originPass){
				uni.showToast({
					title:'请补全信息',
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
							url:'https://www.nssnail.com/wx/personal/updateUserPayPwd',
							method:'POST',
							data:{
								sessionId:this.sessionId,
								newPwd:this.mydata.password,
								oldPwd :this.mydata.originPass
							},
							success:(res)=>{
								console.log(res,'返回的数据')
								if(res.data.stat == 1){
									uni.showToast({
										title:'设置成功',
										icon:'success',
										success:()=>{
											setTimeout(function(){
												uni.navigateBack({
													delta:1
												})
											},2000);
										}
									})
								}else if(res.data.stat == 0){
									uni.showToast({
										title:res.data.message,
										icon:'none'
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
		},
		
		// 找回密码页面跳转
		forgetpass(){
			var check = 2
			uni.navigateTo({
				url:'../checkNumber/checkNumber?check='+check
			})
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
.two{
	width: 92%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	margin-top: 40rpx;
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 180rpx;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	font-weight: 600;
	margin: 0 auto;
}

</style>
