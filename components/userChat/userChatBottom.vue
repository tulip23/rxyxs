<template>
	<view>
		<view class="user-chat-bottom">
			<input type="text" placeholder="请文明发言" v-model="text" />
			<view class="icon iconfont icon-fasong" @tap="submit"></view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			text:''
		}
	},
	methods:{
		submit(){
			// 调用父组件中的submit方法，传的值为this.text
			this.$emit('submit',this.text)
			this.text = ""
		}
	}
}	
</script>

<style scoped>
.user-chat-bottom{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100upx;
	padding: 0 20upx;
	background-color: #FFFFFF;
	border-top: 1upx solid #f5f5f5;
}
.user-chat-bottom input{
	width: 85%;
	border: 1upx solid #f5f5f5;
	padding: 5px 0;
	margin-top: 5px;
	padding-left: 20px;
	background: #f5f5f5;
	border-radius: 20px;
}
.icon{
	position: absolute;
	bottom: 0;
	right: 10px;
	font-size: 20px;
}
</style>
