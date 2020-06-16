<template>
	<view>
		<view class="all">
			<view class="none"></view>
			<uni-list>
				<uni-list-item title="绑定手机号" @tap="surePhone"></uni-list-item>
				<uni-list-item title="身份认证" @tap="identify"></uni-list-item>
			</uni-list>
			<view class="none"></view>
		</view>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	export default {
		data() {
			return {
				sessionId:''
			}
		},
		onLoad(option){
			this.sessionId = option.sessionId
		},
		methods: {
			surePhone(){
				var flags = 1
				uni.navigateTo({
					url:'../checkPhone/checkPhone?sessionId='+this.sessionId+'&flags='+flags
				})
			},
			
			identify(){
				uni.navigateTo({
					url:'../identify/identify?sessionId='+this.sessionId
				})
			}
		}
	}
</script>

<style scoped>
.none{
	width: 92%;
	height: 5rpx;
}
.all{
	width: 92%;
	margin: 30rpx auto;
	border-radius: 10rpx;
	background-color: white;
}
</style>
