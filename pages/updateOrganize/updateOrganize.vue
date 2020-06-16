<template>
	<view>
		<view class="myInfo">
			<view class="three">
				<view class="all">
					<view class="left">机构名称</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="arrays">
							<view class="uni-input">{{arrays[index]}}</view>
						</picker>
					</view>
				</view>
			</view>
			<button class="btn" @tap='sure'>确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				arrays: [],
				index:0,
				sessionId:'',
				myData:[],
				id:1
			}
		},
		onLoad(option) {
			this.sessionId = option.sessionId
			this.init()
		},
		methods: {
			// 机构信息
			init(){
				uni.request({
					url:'https://www.nssnail.com/wx/getRedCrossList',
					data:{
						sessionId:this.sessionId
					},
					success: (res) => {
						this.myData = res.data.data
						this.myData.forEach((item)=>{
							this.arrays.push(item.mname)
						})
					}
				})
			},
			
			// 选择机构
			bindPickerChange: function(e) {
				this.index = e.target.value
				this.id = parseInt(this.index)+1
			},
			
			// 点击提交，修改机构
			sure(){
				console.log(this.id)
				console.log(this.sessionId,'sess')
				uni.request({
					url:'https://www.nssnail.com/wx/personal/updateUserRedCross',
					method:'POST',
					data:{
						sessionId:this.sessionId,
						id:this.id
					},
					success: (res) => {
						if(res.data.stat == 1){
							uni.showToast({
								title:res.data.message,
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
						}else if(res.data.stat == 0){
							uni.showToast({
								title: res.data.message,
								icon:'none',
								duration:3000
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
.myInfo{
	background-color: white;
	width: 92%;
	margin: 20rpx auto;
	border-radius: 10rpx;
	padding-bottom: 20rpx;
}
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
.uni-list-cell-db{
	transform: translateY(-10rpx);
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	font-weight: 600;
	margin-top: 20rpx;
}
</style>
